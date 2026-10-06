<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Voucher
 */
final class VoucherResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'store_id' => $this->store_id,
            'membership_tier_id' => $this->membership_tier_id,
            'service_id' => $this->service_id,
            'discount_type' => $this->discount_type->value,
            'discount_value' => (float) $this->discount_value,
            'min_order_amount' => (float) $this->min_order_amount,
            'max_discount_amount' => $this->max_discount_amount !== null ? (float) $this->max_discount_amount : null,
            'redeem_quota' => $this->redeem_quota,
            'quota_per_user' => $this->quota_per_user,
            'point_cost' => $this->point_cost,
            'start_time' => $this->start_time?->toIso8601String(),
            'end_time' => $this->end_time?->toIso8601String(),
            'is_active' => $this->is_active,
            'description' => $this->description,
            'store' => new StoreResource($this->whenLoaded('store')),
            'membership_tier' => new MembershipTierResource($this->whenLoaded('membershipTier')),
            'service' => new ServiceResource($this->whenLoaded('service')),
        ];
    }
}
