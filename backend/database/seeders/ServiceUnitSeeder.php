<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ServiceUnit;
use Illuminate\Database\Seeder;

class ServiceUnitSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Kg', 'Pcs', 'Set', 'Meter', 'Pasang'] as $unit) {
            ServiceUnit::query()->updateOrCreate(['unit_name' => $unit], ['unit_name' => $unit]);
        }
    }
}
