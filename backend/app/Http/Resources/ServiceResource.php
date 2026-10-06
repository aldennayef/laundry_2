<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Service
 */
final class ServiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service_category_id' => $this->service_category_id,
            'store_id' => $this->store_id,
            'service_unit_id' => $this->service_unit_id,
            'service_name' => $this->service_name,
            'price' => (float) $this->price,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'unit' => $this->whenLoaded('unit', fn () => $this->unit?->unit_name),
            'category' => new ServiceCategoryResource($this->whenLoaded('category')),
            'store' => new StoreResource($this->whenLoaded('store')),
        ];
    }
}
