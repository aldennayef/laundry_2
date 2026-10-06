<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Booking
 */
final class BookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_code' => $this->booking_code,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'cust_name' => $this->cust_name,
            'cust_phone' => $this->cust_phone,
            'cust_address' => $this->cust_address,
            'notes' => $this->notes,
            'booking_date' => $this->booking_date?->toDateString(),
            'pickup_schedule' => $this->pickup_schedule?->toIso8601String(),
            'delivery_schedule' => $this->delivery_schedule?->toIso8601String(),
            'estimated_amount' => (float) $this->estimated_amount,
            'service_type_price' => (float) $this->service_type_price,
            'discount_amount' => (float) $this->discount_amount,
            'final_amount' => (float) $this->final_amount,
            'store' => new StoreResource($this->whenLoaded('store')),
            'service' => new ServiceResource($this->whenLoaded('service')),
            'service_type' => new ServiceTypeResource($this->whenLoaded('serviceType')),
            'voucher' => new VoucherResource($this->whenLoaded('voucher')),
            'customer' => new UserResource($this->whenLoaded('user')),
            'status_logs' => BookingStatusLogResource::collection($this->whenLoaded('statusLogs')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
