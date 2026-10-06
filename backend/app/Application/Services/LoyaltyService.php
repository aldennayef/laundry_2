<?php

declare(strict_types=1);

namespace App\Application\Services;

use App\Application\DTOs\RedeemVoucherDTO;
use App\Domain\Contracts\Repositories\LoyaltyRuleRepositoryInterface;
use App\Domain\Contracts\Repositories\PointTransactionRepositoryInterface;
use App\Domain\Contracts\Repositories\UserRepositoryInterface;
use App\Domain\Contracts\Repositories\VoucherRedemptionRepositoryInterface;
use App\Domain\Contracts\Repositories\VoucherRepositoryInterface;
use App\Domain\Enums\PointTransactionType;
use App\Domain\Enums\VoucherRedemptionStatus;
use App\Domain\Exceptions\LoyaltyException;
use App\Domain\Exceptions\VoucherException;
use App\Models\Booking;
use App\Models\User;
use App\Models\VoucherRedemption;
use Illuminate\Support\Facades\DB;

final class LoyaltyService
{
    public function __construct(
        private readonly PointTransactionRepositoryInterface $pointTransactions,
        private readonly LoyaltyRuleRepositoryInterface $rules,
        private readonly VoucherRepositoryInterface $vouchers,
        private readonly VoucherRedemptionRepositoryInterface $redemptions,
        private readonly UserRepositoryInterface $users,
    ) {
    }

    public function currentBalance(int $userId): int
    {
        return $this->pointTransactions->currentBalance($userId);
    }

    /**
     * Award points for a completed booking (idempotent per booking).
     * Points = floor(final_amount / spend_per_point) * tier multiplier.
     */
    public function awardForBooking(Booking $booking): ?int
    {
        if ($this->pointTransactions->existsForBookingAndType($booking->id, PointTransactionType::EARN->value)) {
            return null;
        }

        $rule = $this->rules->resolveForStore($booking->store_id);
        $spendPerPoint = (float) ($rule?->spend_per_point ?? 0);

        if ($spendPerPoint <= 0) {
            return null;
        }

        /** @var User $user */
        $user = $this->users->findByIdOrFail($booking->user_id);
        $multiplier = (float) ($user->membershipTier?->bonus_point_multiplier ?? 1);
        $points = (int) floor(((float) $booking->final_amount / $spendPerPoint) * $multiplier);

        if ($points <= 0) {
            return null;
        }

        return DB::transaction(function () use ($user, $booking, $points): int {
            $balanceAfter = $this->pointTransactions->currentBalance($user->id) + $points;

            $this->pointTransactions->create([
                'user_id' => $user->id,
                'booking_id' => $booking->id,
                'type' => PointTransactionType::EARN->value,
                'points' => $points,
                'balance_after' => $balanceAfter,
                'note' => "Poin dari booking {$booking->booking_code}",
            ]);

            return $balanceAfter;
        });
    }

    /**
     * Redeem points into a usable voucher for the customer.
     */
    public function redeemVoucher(RedeemVoucherDTO $dto): VoucherRedemption
    {
        return DB::transaction(function () use ($dto): VoucherRedemption {
            /** @var User $user */
            $user = $this->users->findByIdOrFail($dto->userId);
            $voucher = $this->vouchers->findById($dto->voucherId);

            if ($voucher === null) {
                throw VoucherException::notFound();
            }

            if (! $voucher->is_active) {
                throw VoucherException::inactive();
            }

            if ($voucher->membership_tier_id !== null && $user->membership_tier_id !== $voucher->membership_tier_id) {
                throw VoucherException::tierNotEligible();
            }

            $balance = $this->pointTransactions->currentBalance($user->id);
            $cost = (int) $voucher->point_cost;

            if ($cost <= 0) {
                throw new LoyaltyException('Voucher ini tidak dapat ditukar dengan poin.');
            }

            if ($balance < $cost) {
                throw LoyaltyException::insufficientPoints($balance, $cost);
            }

            if ($voucher->redeem_quota !== null && $voucher->redemptions()->count() >= $voucher->redeem_quota) {
                throw VoucherException::quotaExhausted();
            }

            if ($voucher->quota_per_user !== null) {
                $usedByUser = $user->voucherRedemptions()->where('voucher_id', $voucher->id)->count();

                if ($usedByUser >= $voucher->quota_per_user) {
                    throw VoucherException::userQuotaExceeded();
                }
            }

            $redemption = $this->redemptions->create([
                'user_id' => $user->id,
                'voucher_id' => $voucher->id,
                'points_used' => $cost,
                'redeemed_at' => now(),
                'status' => VoucherRedemptionStatus::ACTIVE->value,
            ]);

            $this->pointTransactions->create([
                'user_id' => $user->id,
                'type' => PointTransactionType::REDEEM->value,
                'points' => -$cost,
                'balance_after' => $balance - $cost,
                'note' => "Penukaran voucher {$voucher->code}",
            ]);

            return $redemption->load('voucher');
        });
    }
}
