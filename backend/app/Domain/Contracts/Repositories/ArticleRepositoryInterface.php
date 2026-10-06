<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ArticleRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, Article>
     */
    public function published(array $relations = []): Collection;

    public function findBySlug(string $slug): ?Article;

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator;
}
