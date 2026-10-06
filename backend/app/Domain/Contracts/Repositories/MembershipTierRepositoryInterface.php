<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\MembershipTier;
use Illuminate\Database\Eloquent\Collection;

interface MembershipTierRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, MembershipTier>
     */
    public function allOrdered(): Collection;

    /**
     * Find the highest tier whose min_spend is satisfied by the given total spend.
     */
    public function resolveForSpend(float $totalSpend): ?MembershipTier;
}
