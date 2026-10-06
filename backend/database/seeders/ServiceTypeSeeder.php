<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ServiceTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['service_type_name' => 'Reguler', 'processing_time' => 3, 'processing_time_unit' => 'hari', 'price' => 0],
            ['service_type_name' => 'Express', 'processing_time' => 1, 'processing_time_unit' => 'hari', 'price' => 5000],
            ['service_type_name' => 'Kilat (Same Day)', 'processing_time' => 6, 'processing_time_unit' => 'jam', 'price' => 12000],
        ];

        foreach ($types as $type) {
            ServiceType::query()->updateOrCreate(
                ['service_type_name' => $type['service_type_name']],
                $type,
            );
        }
    }
}
