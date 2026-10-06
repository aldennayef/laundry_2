<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\LoyaltyRuleRepositoryInterface;
use App\Models\LoyaltyRule;
use Illuminate\Database\Eloquent\Collection;

final class LoyaltyRuleRepository extends BaseRepository implements LoyaltyRuleRepositoryInterface
{
    public function __construct(LoyaltyRule $model)
    {
        parent::__construct($model);
    }

    public function resolveForStore(?int $storeId): ?LoyaltyRule
    {
        if ($storeId !== null) {
            $storeRule = LoyaltyRule::query()
                ->active()
                ->where('store_id', $storeId)
                ->first();

            if ($storeRule !== null) {
                return $storeRule;
            }
        }

        return LoyaltyRule::query()->active()->whereNull('store_id')->first();
    }

    public function allOrdered(): Collection
    {
        return LoyaltyRule::query()->with('store')->orderBy('store_id')->get();
    }
}
