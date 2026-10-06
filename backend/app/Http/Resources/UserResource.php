<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\User
 */
final class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'username' => $this->username,
            'phone' => $this->phone,
            'balance' => (float) $this->balance,
            'total_spend' => (float) $this->total_spend,
            'is_active' => $this->is_active,
            'role' => $this->whenLoaded('role', fn () => $this->role?->role_name),
            'store' => $this->whenLoaded('store', fn () => $this->store ? [
                'id' => $this->store->id,
                'store_name' => $this->store->store_name,
            ] : null),
            'membership_tier' => $this->whenLoaded('membershipTier', fn () => $this->membershipTier ? [
                'id' => $this->membershipTier->id,
                'tier_name' => $this->membershipTier->tier_name,
                'discount_percent' => (float) $this->membershipTier->discount_percent,
                'bonus_point_multiplier' => (float) $this->membershipTier->bonus_point_multiplier,
            ] : null),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
