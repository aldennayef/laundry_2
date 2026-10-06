<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\OrderSchedule;
use App\Models\Store;
use Illuminate\Database\Seeder;

class OrderScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        foreach (Store::query()->get() as $store) {
            foreach ($days as $day) {
                foreach (['pickup', 'delivery'] as $type) {
                    OrderSchedule::query()->updateOrCreate(
                        ['store_id' => $store->id, 'day' => $day, 'type' => $type],
                        ['start_time' => '08:00', 'end_time' => '17:00', 'is_active' => true],
                    );
                }
            }
        }
    }
}
