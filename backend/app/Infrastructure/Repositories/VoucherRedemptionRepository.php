<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\VoucherRedemptionRepositoryInterface;
use App\Domain\Enums\VoucherRedemptionStatus;
use App\Models\VoucherRedemption;
use Illuminate\Database\Eloquent\Collection;

final class VoucherRedemptionRepository extends BaseRepository implements VoucherRedemptionRepositoryInterface
{
    public function __construct(VoucherRedemption $model)
    {
        parent::__construct($model);
    }

    public function byUser(int $userId, array $relations = []): Collection
    {
        return VoucherRedemption::query()
            ->with(array_merge(['voucher'], $relations))
            ->where('user_id', $userId)
            ->latest('id')
            ->get();
    }

    public function findActiveByUserAndVoucher(int $userId, int $voucherId): ?VoucherRedemption
    {
        return VoucherRedemption::query()
            ->where('user_id', $userId)
            ->where('voucher_id', $voucherId)
            ->where('status', VoucherRedemptionStatus::ACTIVE->value)
            ->first();
    }
}
