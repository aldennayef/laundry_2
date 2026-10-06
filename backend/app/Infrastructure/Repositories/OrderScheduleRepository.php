<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\OrderScheduleRepositoryInterface;
use App\Models\OrderSchedule;
use Illuminate\Database\Eloquent\Collection;

final class OrderScheduleRepository extends BaseRepository implements OrderScheduleRepositoryInterface
{
    public function __construct(OrderSchedule $model)
    {
        parent::__construct($model);
    }

    public function byStore(int $storeId): Collection
    {
        return OrderSchedule::query()
            ->where('store_id', $storeId)
            ->orderByRaw("CASE day
                WHEN 'monday' THEN 1 WHEN 'tuesday' THEN 2 WHEN 'wednesday' THEN 3
                WHEN 'thursday' THEN 4 WHEN 'friday' THEN 5 WHEN 'saturday' THEN 6
                WHEN 'sunday' THEN 7 ELSE 8 END")
            ->orderBy('start_time')
            ->get();
    }
}
