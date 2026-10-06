<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\ServiceCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ServiceCategoryRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, ServiceCategory>
     */
    public function byStore(int $storeId, array $relations = []): Collection;

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator;
}
