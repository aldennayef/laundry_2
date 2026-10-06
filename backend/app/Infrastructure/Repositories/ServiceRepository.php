<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\ServiceRepositoryInterface;
use App\Models\Service;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final class ServiceRepository extends BaseRepository implements ServiceRepositoryInterface
{
    public function __construct(Service $model)
    {
        parent::__construct($model);
    }

    public function activeByStore(int $storeId, array $relations = []): Collection
    {
        return Service::query()
            ->with($relations)
            ->where('store_id', $storeId)
            ->active()
            ->orderBy('service_name')
            ->get();
    }

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator
    {
        return Service::query()
            ->with(['category', 'store', 'unit'])
            ->when($filters['store_id'] ?? null, fn ($q, $storeId) => $q->where('store_id', $storeId))
            ->when($filters['service_category_id'] ?? null, fn ($q, $catId) => $q->where('service_category_id', $catId))
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where('service_name', 'ilike', "%{$search}%"))
            ->when(isset($filters['is_active']) && $filters['is_active'] !== '', fn ($q) => $q->where('is_active', (bool) $filters['is_active']))
            ->latest('id')
            ->paginate($perPage);
    }
}
