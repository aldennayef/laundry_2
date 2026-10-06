<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\VoucherRepositoryInterface;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final class VoucherRepository extends BaseRepository implements VoucherRepositoryInterface
{
    public function __construct(Voucher $model)
    {
        parent::__construct($model);
    }

    public function findByCode(string $code): ?Voucher
    {
        return Voucher::query()->whereRaw('LOWER(code) = ?', [strtolower($code)])->first();
    }

    public function codeExists(string $code, ?int $exceptId = null): bool
    {
        return Voucher::query()
            ->where('code', $code)
            ->when($exceptId !== null, fn ($q) => $q->whereKeyNot($exceptId))
            ->exists();
    }

    public function activeRedeemable(): Collection
    {
        return Voucher::query()
            ->active()
            ->where('point_cost', '>', 0)
            ->with(['store', 'membershipTier', 'service'])
            ->orderBy('point_cost')
            ->get();
    }

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator
    {
        return Voucher::query()
            ->with(['store', 'membershipTier', 'service'])
            ->when($filters['store_id'] ?? null, fn ($q, $storeId) => $q->where('store_id', $storeId))
            ->when($filters['search'] ?? null, function ($q, $search): void {
                $q->where(function ($sub) use ($search): void {
                    $sub->where('code', 'ilike', "%{$search}%")
                        ->orWhere('description', 'ilike', "%{$search}%");
                });
            })
            ->when(isset($filters['is_active']) && $filters['is_active'] !== '', fn ($q) => $q->where('is_active', (bool) $filters['is_active']))
            ->latest('id')
            ->paginate($perPage);
    }
}
