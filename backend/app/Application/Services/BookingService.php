<?php

declare(strict_types=1);

namespace App\Application\Services;

use App\Application\DTOs\CreateBookingDTO;
use App\Application\DTOs\UpdateBookingStatusDTO;
use App\Domain\Contracts\Repositories\BookingRepositoryInterface;
use App\Domain\Contracts\Repositories\BookingStatusLogRepositoryInterface;
use App\Domain\Contracts\Repositories\ServiceRepositoryInterface;
use App\Domain\Contracts\Repositories\StoreRepositoryInterface;
use App\Domain\Contracts\Repositories\ServiceTypeRepositoryInterface;
use App\Domain\Contracts\Repositories\UserRepositoryInterface;
use App\Domain\Contracts\Repositories\VoucherRepositoryInterface;
use App\Domain\Enums\BookingStatus;
use App\Domain\Enums\PointTransactionType;
use App\Domain\Exceptions\BookingException;
use App\Domain\Exceptions\StoreException;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class BookingService
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookings,
        private readonly BookingStatusLogRepositoryInterface $logs,
        private readonly ServiceRepositoryInterface $services,
        private readonly ServiceTypeRepositoryInterface $serviceTypes,
        private readonly StoreRepositoryInterface $stores,
        private readonly VoucherRepositoryInterface $vouchers,
        private readonly VoucherService $voucherService,
        private readonly LoyaltyService $loyalty,
        private readonly TierService $tiers,
        private readonly UserRepositoryInterface $users,
    ) {
    }

    /**
     * Create a booking with server-side price calculation.
     * Never trusts client-provided amounts.
     */
    public function create(CreateBookingDTO $dto): Booking
    {
        $store = $this->stores->findById($dto->storeId);

        if ($store === null) {
            throw StoreException::notFound();
        }

        if (! $store->is_active) {
            throw StoreException::inactive();
        }

        $service = $this->services->findById($dto->serviceId);

        if ($service === null || $service->store_id !== $store->id) {
            throw BookingException::serviceNotBelongToStore();
        }

        $serviceTypePrice = 0.0;
        if ($dto->serviceTypeId !== null) {
            $serviceType = $this->serviceTypes->findById($dto->serviceTypeId);
            $serviceTypePrice = $serviceType !== null ? (float) $serviceType->price : 0.0;
        }

        $estimatedAmount = (float) $service->price;

        /** @var User $user */
        $user = $this->users->findByIdOrFail($dto->userId);

        // Tier discount applies on top of voucher discount.
        $tierDiscount = round($estimatedAmount * ($this->tiers->discountPercentFor($user) / 100), 2);

        $voucherDiscount = 0.0;
        $voucher = null;
        if ($dto->voucherId !== null) {
            $voucher = $this->vouchers->findById($dto->voucherId);

            if ($voucher === null) {
                throw BookingException::serviceNotBelongToStore();
            }

            $this->voucherService->validateForBooking($voucher, $user, $store->id, $estimatedAmount);
            $voucherDiscount = $this->voucherService->calculateDiscount($voucher, $estimatedAmount);
        }

        $discountAmount = round($tierDiscount + $voucherDiscount, 2);
        $finalAmount = round(max(0, $estimatedAmount - $discountAmount) + $serviceTypePrice, 2);

        return DB::transaction(function () use ($dto, $store, $service, $voucher, $user, $serviceTypePrice, $estimatedAmount, $discountAmount, $voucherDiscount, $finalAmount): Booking {
            $booking = $this->bookings->create([
                'booking_code' => $this->bookings->generateBookingCode(),
                'user_id' => $user->id,
                'store_id' => $store->id,
                'service_id' => $service->id,
                'service_type_id' => $dto->serviceTypeId,
                'voucher_id' => $voucher?->id,
                'cust_name' => $dto->custName,
                'cust_phone' => $dto->custPhone,
                'cust_address' => $dto->custAddress,
                'notes' => $dto->notes,
                'booking_date' => $dto->bookingDate,
                'pickup_schedule' => $dto->pickupSchedule,
                'delivery_schedule' => $dto->deliverySchedule,
                'estimated_amount' => $estimatedAmount,
                'service_type_price' => $serviceTypePrice,
                'discount_amount' => $discountAmount,
                'final_amount' => $finalAmount,
                'status' => BookingStatus::PENDING->value,
            ]);

            $this->logs->create([
                'booking_id' => $booking->id,
                'status' => BookingStatus::PENDING->value,
                'note' => 'Booking dibuat oleh customer.',
                'changed_by' => $user->id,
            ]);

            if ($voucher !== null && $voucherDiscount > 0) {
                $this->voucherService->consumeRedemptionForBooking($user->id, $voucher->id, $booking);
            }

            return $booking->load(['store', 'service', 'serviceType', 'voucher', 'statusLogs']);
        });
    }

    /**
     * Transition a booking to a new status using the state machine.
     */
    public function updateStatus(UpdateBookingStatusDTO $dto, User $actor): Booking
    {
        /** @var Booking $booking */
        $booking = $this->bookings->findByIdOrFail($dto->bookingId);
        $from = $booking->status;
        $to = BookingStatus::from($dto->status);

        if ($from->isFinal()) {
            throw BookingException::alreadyFinal();
        }

        if (! $from->canTransitionTo($to)) {
            throw BookingException::invalidStatusTransition($from, $to);
        }

        return DB::transaction(function () use ($booking, $from, $to, $dto, $actor): Booking {
            $booking->status = $to;
            $booking->save();

            $this->logs->create([
                'booking_id' => $booking->id,
                'status' => $to->value,
                'note' => $dto->note ?? sprintf('Status diubah dari %s ke %s.', $from->label(), $to->label()),
                'changed_by' => $actor->id,
            ]);

            // On completion: accrue spend, sync tier, and award loyalty points.
            if ($to->isPointEligible() && ! $this->loyaltyPointsAlreadyAwarded($booking, $actor)) {
                $user = $this->users->findByIdOrFail($booking->user_id);
                $user->total_spend = (float) $user->total_spend + (float) $booking->final_amount;
                $user->save();

                $this->tiers->syncUserTier($user);
                $user->load('membershipTier');
                $this->loyalty->awardForBooking($booking);
            }

            return $booking->fresh(['store', 'service', 'serviceType', 'voucher', 'statusLogs']);
        });
    }

    private function loyaltyPointsAlreadyAwarded(Booking $booking, User $actor): bool
    {
        // Guard against double-award when a booking has any prior earn transaction.
        return DB::table('tbl_point_transactions')
            ->where('booking_id', $booking->id)
            ->where('type', PointTransactionType::EARN->value)
            ->exists();
    }

    public function cancelByCustomer(Booking $booking, User $user): Booking
    {
        if ($booking->user_id !== $user->id) {
            throw BookingException::notFound();
        }

        if (! in_array($booking->status, [BookingStatus::PENDING, BookingStatus::CONFIRMED], true)) {
            throw BookingException::alreadyFinal();
        }

        $booking->status = BookingStatus::CANCELLED;
        $booking->save();

        $this->logs->create([
            'booking_id' => $booking->id,
            'status' => BookingStatus::CANCELLED->value,
            'note' => 'Dibatalkan oleh customer.',
            'changed_by' => $user->id,
        ]);

        return $booking->fresh(['statusLogs']);
    }
}
