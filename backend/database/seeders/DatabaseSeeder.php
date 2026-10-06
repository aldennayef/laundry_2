<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            MembershipTierSeeder::class,
            ServiceUnitSeeder::class,
            ServiceTypeSeeder::class,
            StoreSeeder::class,
            UserSeeder::class,
            CatalogSeeder::class,
            OrderScheduleSeeder::class,
        ]);
    }
}
