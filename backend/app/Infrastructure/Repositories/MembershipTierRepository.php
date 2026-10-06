<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\MembershipTierRepositoryInterface;
use App\Models\MembershipTier;
use Illuminate\Database\Eloquent\Collection;

final class MembershipTierRepository extends BaseRepository implements MembershipTierRepositoryInterface
{
    public function __construct(MembershipTier $model)
    {
        parent::__construct($model);
    }

    public function allOrdered(): Collection
    {
        return MembershipTier::query()->orderBy('min_spend')->get();
    }

    public function resolveForSpend(float $totalSpend): ?MembershipTier
    {
        return MembershipTier::query()
            ->where('min_spend', '<=', $totalSpend)
            ->orderByDesc('min_spend')
            ->first();
    }
}
