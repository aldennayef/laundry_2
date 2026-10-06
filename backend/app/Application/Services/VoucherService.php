<?php

declare(strict_types=1);

namespace App\Application\Services;

use App\Application\DTOs\RedeemVoucherDTO;
use App\Domain\Contracts\Repositories\BookingRepositoryInterface;
use App\Domain\Contracts\Repositories\VoucherRedemptionRepositoryInterface;
use App\Domain\Contracts\Repositories\VoucherRepositoryInterface;
use App\Domain\Enums\DiscountType;
use App\Domain\Enums\VoucherRedemptionStatus;
use App\Domain\Exceptions\VoucherException;
use App\Models\Booking;
use App\Models\User;
use App\Models\Voucher;

final class VoucherService
{
    public function __construct(
        private readonly VoucherRepositoryInterface $vouchers,
        private readonly VoucherRedemptionRepositoryInterface $redemptions,
        private readonly BookingRepositoryInterface $bookings,
    ) {
    }

    /**
     * Validate a voucher against the given context. Throws on any violation.
     */
    public function validateForBooking(Voucher $voucher, User $user, int $storeId, float $amount): void
    {
        if (! $voucher->is_active) {
            throw VoucherException::inactive();
        }

        if ($voucher->start_time !== null && $voucher->start_time->isFuture()) {
            throw VoucherException::notStarted();
        }

        if ($voucher->end_time !== null && $voucher->end_time->isPast()) {
            throw VoucherException::expired();
        }

        if ($voucher->store_id !== null && $voucher->store_id !== $storeId) {
            throw VoucherException::storeNotEligible();
        }

        if ($voucher->membership_tier_id !== null && $user->membership_tier_id !== $voucher->membership_tier_id) {
            throw VoucherException::tierNotEligible();
        }

        if ($amount < (float) $voucher->min_order_amount) {
            throw VoucherException::belowMinimumAmount((float) $voucher->min_order_amount);
        }

        if ($voucher->quota_per_user !== null) {
            $used = $this->bookings->countUserVoucherUsage($user->id, $voucher->id);

            if ($used >= $voucher->quota_per_user) {
                throw VoucherException::userQuotaExceeded();
            }
        }

        if ($voucher->redeem_quota !== null && $voucher->redemptions()->count() >= $voucher->redeem_quota) {
            throw VoucherException::quotaExhausted();
        }
    }

    /**
     * Compute the discount amount for a voucher on a given subtotal.
     */
    public function calculateDiscount(Voucher $voucher, float $amount): float
    {
        $discount = $voucher->discount_type === DiscountType::PERCENT
            ? $amount * ((float) $voucher->discount_value / 100)
            : (float) $voucher->discount_value;

        if ($voucher->max_discount_amount !== null) {
            $discount = min($discount, (float) $voucher->max_discount_amount);
        }

        return round(min($discount, $amount), 2);
    }

    /**
     * Convert a redemption into an active voucher payload for a booking.
     */
    public function consumeRedemptionForBooking(int $userId, int $voucherId, Booking $booking): void
    {
        $redemption = $this->redemptions->findActiveByUserAndVoucher($userId, $voucherId);

        if ($redemption === null) {
            return;
        }

        $redemption->status = VoucherRedemptionStatus::USED;
        $redemption->used_at = now();
        $redemption->save();
    }
}
