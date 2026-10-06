<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\LoyaltyRule;
use Illuminate\Database\Eloquent\Collection;

interface LoyaltyRuleRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Resolve the active rule for a store, falling back to the global rule.
     */
    public function resolveForStore(?int $storeId): ?LoyaltyRule;

    /**
     * @return Collection<int, LoyaltyRule>
     */
    public function allOrdered(): Collection;
}
