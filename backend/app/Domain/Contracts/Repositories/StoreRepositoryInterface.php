<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface StoreRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, Store>
     */
    public function active(): Collection;

    public function findWithRelations(int $id, array $relations = []): ?Store;

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator;
}
