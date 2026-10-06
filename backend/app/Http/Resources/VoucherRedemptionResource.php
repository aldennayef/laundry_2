<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\VoucherRedemption
 */
final class VoucherRedemptionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'voucher_id' => $this->voucher_id,
            'points_used' => $this->points_used,
            'status' => $this->status->value,
            'redeemed_at' => $this->redeemed_at?->toIso8601String(),
            'used_at' => $this->used_at?->toIso8601String(),
            'voucher' => new VoucherResource($this->whenLoaded('voucher')),
        ];
    }
}
