<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\VoucherRedemption;
use Illuminate\Database\Eloquent\Collection;

interface VoucherRedemptionRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, VoucherRedemption>
     */
    public function byUser(int $userId, array $relations = []): Collection;

    public function findActiveByUserAndVoucher(int $userId, int $voucherId): ?VoucherRedemption;
}
