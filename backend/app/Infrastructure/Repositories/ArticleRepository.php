<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\ArticleRepositoryInterface;
use App\Models\Article;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final class ArticleRepository extends BaseRepository implements ArticleRepositoryInterface
{
    public function __construct(Article $model)
    {
        parent::__construct($model);
    }

    public function published(array $relations = []): Collection
    {
        return Article::query()
            ->with($relations)
            ->published()
            ->latest('published_at')
            ->get();
    }

    public function findBySlug(string $slug): ?Article
    {
        return Article::query()->with('author')->where('slug', $slug)->first();
    }

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator
    {
        return Article::query()
            ->with('author')
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where('title', 'ilike', "%{$search}%"))
            ->when(isset($filters['is_active']) && $filters['is_active'] !== '', fn ($q) => $q->where('is_active', (bool) $filters['is_active']))
            ->latest('id')
            ->paginate($perPage);
    }
}
