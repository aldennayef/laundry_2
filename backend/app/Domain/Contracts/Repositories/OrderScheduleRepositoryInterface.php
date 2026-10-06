<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\OrderSchedule;
use Illuminate\Database\Eloquent\Collection;

interface OrderScheduleRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, OrderSchedule>
     */
    public function byStore(int $storeId): Collection;
}
