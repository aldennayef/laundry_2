<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $stores = [
            [
                'store_name' => 'Washe Pusat — Jakarta',
                'phone' => '021-5550001',
                'whatsapp_number' => '6281100000001',
                'email' => 'jakarta@washe.test',
                'address' => 'Jl. Merdeka No. 1',
                'city' => 'Jakarta',
                'latitude' => -6.175392,
                'longitude' => 106.827153,
                'operating_hours' => 'Senin–Sabtu 08:00–20:00',
                'is_active' => true,
            ],
            [
                'store_name' => 'Washe Cabang Bandung',
                'phone' => '022-5550002',
                'whatsapp_number' => '6281100000002',
                'email' => 'bandung@washe.test',
                'address' => 'Jl. Asia Afrika No. 10',
                'city' => 'Bandung',
                'latitude' => -6.921589,
                'longitude' => 107.607147,
                'operating_hours' => 'Senin–Sabtu 08:00–20:00',
                'is_active' => true,
            ],
        ];

        foreach ($stores as $store) {
            Store::query()->updateOrCreate(['store_name' => $store['store_name']], $store);
        }
    }
}
