<?php

declare(strict_types=1);

namespace App\Application\Services;

use App\Domain\Contracts\Repositories\MembershipTierRepositoryInterface;
use App\Models\User;

final class TierService
{
    public function __construct(
        private readonly MembershipTierRepositoryInterface $tiers,
    ) {
    }

    public function resolveTierIdForSpend(float $totalSpend): ?int
    {
        return $this->tiers->resolveForSpend($totalSpend)?->id;
    }

    /**
     * Recalculate and persist the user's tier based on total spend.
     * Returns true when the tier actually changed.
     */
    public function syncUserTier(User $user): bool
    {
        $tier = $this->tiers->resolveForSpend((float) $user->total_spend);

        if ($tier === null || $user->membership_tier_id === $tier->id) {
            return false;
        }

        $user->membership_tier_id = $tier->id;
        $user->save();

        return true;
    }

    /**
     * Discount percent granted by the user's current tier.
     */
    public function discountPercentFor(User $user): float
    {
        return (float) ($user->membershipTier?->discount_percent ?? 0);
    }

    /**
     * Point multiplier granted by the user's current tier.
     */
    public function pointMultiplierFor(User $user): float
    {
        return (float) ($user->membershipTier?->bonus_point_multiplier ?? 1);
    }
}
