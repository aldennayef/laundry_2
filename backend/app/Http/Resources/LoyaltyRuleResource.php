<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\LoyaltyRule
 */
final class LoyaltyRuleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'store_id' => $this->store_id,
            'rule_name' => $this->rule_name,
            'spend_per_point' => (float) $this->spend_per_point,
            'is_active' => $this->is_active,
            'store' => new StoreResource($this->whenLoaded('store')),
        ];
    }
}
