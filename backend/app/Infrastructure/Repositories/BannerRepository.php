<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\BannerRepositoryInterface;
use App\Models\Banner;
use Illuminate\Database\Eloquent\Collection;

final class BannerRepository extends BaseRepository implements BannerRepositoryInterface
{
    public function __construct(Banner $model)
    {
        parent::__construct($model);
    }

    public function activeByPosition(string $position): Collection
    {
        return Banner::query()
            ->visible()
            ->where('position', $position)
            ->orderBy('sort_order')
            ->get();
    }
}
