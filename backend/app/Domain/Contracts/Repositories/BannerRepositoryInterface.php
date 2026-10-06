<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\Banner;
use Illuminate\Database\Eloquent\Collection;

interface BannerRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, Banner>
     */
    public function activeByPosition(string $position): Collection;
}
