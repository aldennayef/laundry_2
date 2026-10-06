<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\StoreRepositoryInterface;
use App\Models\Store;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final class StoreRepository extends BaseRepository implements StoreRepositoryInterface
{
    public function __construct(Store $model)
    {
        parent::__construct($model);
    }

    public function active(): Collection
    {
        return Store::query()->active()->orderBy('store_name')->get();
    }

    public function findWithRelations(int $id, array $relations = []): ?Store
    {
        return Store::query()->with($relations)->find($id);
    }

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator
    {
        return Store::query()
            ->when($filters['search'] ?? null, function ($q, $search): void {
                $q->where(function ($sub) use ($search): void {
                    $sub->where('store_name', 'ilike', "%{$search}%")
                        ->orWhere('city', 'ilike', "%{$search}%");
                });
            })
            ->when(isset($filters['is_active']) && $filters['is_active'] !== '', fn ($q) => $q->where('is_active', (bool) $filters['is_active']))
            ->latest('id')
            ->paginate($perPage);
    }
}
