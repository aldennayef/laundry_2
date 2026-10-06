<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\MembershipTier
 */
final class MembershipTierResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tier_name' => $this->tier_name,
            'min_spend' => (float) $this->min_spend,
            'discount_percent' => (float) $this->discount_percent,
            'bonus_point_multiplier' => (float) $this->bonus_point_multiplier,
        ];
    }
}
