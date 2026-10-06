<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\Voucher;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface VoucherRepositoryInterface extends BaseRepositoryInterface
{
    public function findByCode(string $code): ?Voucher;

    public function codeExists(string $code, ?int $exceptId = null): bool;

    /**
     * Vouchers currently redeemable/purchasable with points.
     *
     * @return Collection<int, Voucher>
     */
    public function activeRedeemable(): Collection;

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator;
}
