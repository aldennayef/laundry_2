<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\PointTransaction
 */
final class PointTransactionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'points' => $this->points,
            'balance_after' => $this->balance_after,
            'note' => $this->note,
            'booking_code' => $this->whenLoaded('booking', fn () => $this->booking?->booking_code),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
