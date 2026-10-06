<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\LoyaltyRule;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceUnit;
use App\Models\Store;
use App\Models\Voucher;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $kgUnitId = (int) ServiceUnit::query()->where('unit_name', 'Kg')->value('id');
        $pcsUnitId = (int) ServiceUnit::query()->where('unit_name', 'Pcs')->value('id');

        $catalog = [
            ['category' => 'Cuci Kering', 'description' => 'Cuci lalu keringkan tanpa setrika.', 'services' => [
                ['name' => 'Cuci Kering Reguler', 'price' => 7000, 'unit' => $kgUnitId],
                ['name' => 'Cuci Kering Express', 'price' => 12000, 'unit' => $kgUnitId],
            ]],
            ['category' => 'Cuci Setrika', 'description' => 'Cuci, keringkan, dan setrika.', 'services' => [
                ['name' => 'Cuci Setrika Reguler', 'price' => 10000, 'unit' => $kgUnitId],
                ['name' => 'Cuci Setrika Express', 'price' => 16000, 'unit' => $kgUnitId],
            ]],
            ['category' => 'Satuan', 'description' => 'Layanan satuan untuk item tertentu.', 'services' => [
                ['name' => 'Bed Cover King', 'price' => 45000, 'unit' => $pcsUnitId],
                ['name' => 'Jas / Blazer', 'price' => 35000, 'unit' => $pcsUnitId],
                ['name' => 'Gaun / Dress', 'price' => 30000, 'unit' => $pcsUnitId],
            ]],
        ];

        foreach (Store::query()->get() as $store) {
            foreach ($catalog as $group) {
                $category = ServiceCategory::query()->updateOrCreate(
                    ['store_id' => $store->id, 'category_name' => $group['category']],
                    ['description' => $group['description']],
                );

                foreach ($group['services'] as $svc) {
                    Service::query()->updateOrCreate(
                        ['store_id' => $store->id, 'service_category_id' => $category->id, 'service_name' => $svc['name']],
                        [
                            'service_unit_id' => $svc['unit'],
                            'price' => $svc['price'],
                            'description' => $group['description'],
                            'is_active' => true,
                        ],
                    );
                }
            }

            // Aturan loyalitas: 1 poin per Rp1.000 belanja.
            LoyaltyRule::query()->updateOrCreate(
                ['store_id' => $store->id, 'rule_name' => 'Default'],
                ['spend_per_point' => 1000, 'is_active' => true],
            );

            // Voucher contoh: diskon tetap 10.000 untuk min. belanja 50.000, tukar 20 poin.
            Voucher::query()->updateOrCreate(
                ['code' => 'HEMAT10K-'.$store->id],
                [
                    'store_id' => $store->id,
                    'membership_tier_id' => null,
                    'service_id' => null,
                    'discount_type' => 'fixed',
                    'discount_value' => 10000,
                    'min_order_amount' => 50000,
                    'max_discount_amount' => 10000,
                    'redeem_quota' => 100,
                    'quota_per_user' => 1,
                    'point_cost' => 20,
                    'is_active' => true,
                    'description' => 'Potongan Rp10.000 min. belanja Rp50.000.',
                ],
            );
        }

        // Aturan loyalitas global (fallback untuk customer tanpa store).
        LoyaltyRule::query()->updateOrCreate(
            ['store_id' => null, 'rule_name' => 'Global'],
            ['spend_per_point' => 1000, 'is_active' => true],
        );
    }
}
