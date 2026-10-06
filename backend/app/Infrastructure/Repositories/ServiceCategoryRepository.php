<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\ServiceCategoryRepositoryInterface;
use App\Models\ServiceCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final class ServiceCategoryRepository extends BaseRepository implements ServiceCategoryRepositoryInterface
{
    public function __construct(ServiceCategory $model)
    {
        parent::__construct($model);
    }

    public function byStore(int $storeId, array $relations = []): Collection
    {
        return ServiceCategory::query()
            ->with($relations)
            ->where('store_id', $storeId)
            ->orderBy('category_name')
            ->get();
    }

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator
    {
        return ServiceCategory::query()
            ->with('store')
            ->when($filters['store_id'] ?? null, fn ($q, $storeId) => $q->where('store_id', $storeId))
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where('category_name', 'ilike', "%{$search}%"))
            ->latest('id')
            ->paginate($perPage);
    }
}
