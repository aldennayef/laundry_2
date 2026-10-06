<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Domain\Enums\RoleEnum;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        foreach (RoleEnum::cases() as $role) {
            Role::query()->updateOrCreate(
                ['role_name' => $role->value],
                ['role_name' => $role->value],
            );
        }
    }
}
