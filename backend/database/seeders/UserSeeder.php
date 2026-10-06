<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Domain\Enums\RoleEnum;
use App\Models\MembershipTier;
use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roleId = fn (RoleEnum $r): int => (int) Role::query()->where('role_name', $r->value)->value('id');
        $tierId = (int) MembershipTier::query()->orderBy('min_spend')->value('id');
        $storeId = (int) Store::query()->orderBy('id')->value('id');

        // Root — akses seluruh sistem
        User::query()->updateOrCreate(
            ['email' => 'root@washe.test'],
            [
                'role_id' => $roleId(RoleEnum::ROOT),
                'store_id' => null,
                'membership_tier_id' => null,
                'username' => 'root',
                'phone' => '6281100000010',
                'password' => Hash::make('password'),
                'is_active' => true,
            ],
        );

        // Admin cabang — terikat satu store
        User::query()->updateOrCreate(
            ['email' => 'admin@washe.test'],
            [
                'role_id' => $roleId(RoleEnum::ADMIN_CABANG),
                'store_id' => $storeId,
                'membership_tier_id' => null,
                'username' => 'admin_jakarta',
                'phone' => '6281100000011',
                'password' => Hash::make('password'),
                'is_active' => true,
            ],
        );

        // Customer contoh
        User::query()->updateOrCreate(
            ['email' => 'customer@washe.test'],
            [
                'role_id' => $roleId(RoleEnum::CUSTOMER),
                'store_id' => null,
                'membership_tier_id' => $tierId,
                'username' => 'customer_demo',
                'phone' => '6281100000012',
                'password' => Hash::make('password'),
                'balance' => 0,
                'total_spend' => 0,
                'is_active' => true,
            ],
        );
    }
}
