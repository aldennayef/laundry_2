<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\MembershipTier;
use Illuminate\Database\Seeder;

class MembershipTierSeeder extends Seeder
{
    public function run(): void
    {
        $tiers = [
            ['tier_name' => 'Bronze', 'min_spend' => 0, 'discount_percent' => 0, 'bonus_point_multiplier' => 1],
            ['tier_name' => 'Silver', 'min_spend' => 500000, 'discount_percent' => 5, 'bonus_point_multiplier' => 1.25],
            ['tier_name' => 'Gold', 'min_spend' => 2000000, 'discount_percent' => 10, 'bonus_point_multiplier' => 1.5],
            ['tier_name' => 'Platinum', 'min_spend' => 5000000, 'discount_percent' => 15, 'bonus_point_multiplier' => 2],
        ];

        foreach ($tiers as $tier) {
            MembershipTier::query()->updateOrCreate(
                ['tier_name' => $tier['tier_name']],
                $tier,
            );
        }
    }
}
