<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\Page;

interface PageRepositoryInterface extends BaseRepositoryInterface
{
    public function findBySlug(string $slug): ?Page;

    public function slugExists(string $slug, ?int $exceptId = null): bool;
}
