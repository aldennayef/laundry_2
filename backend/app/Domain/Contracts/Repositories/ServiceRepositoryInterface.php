<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ServiceRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, Service>
     */
    public function activeByStore(int $storeId, array $relations = []): Collection;

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator;
}
