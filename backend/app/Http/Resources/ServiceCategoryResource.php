<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\ServiceCategory
 */
final class ServiceCategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'store_id' => $this->store_id,
            'category_name' => $this->category_name,
            'description' => $this->description,
            'store' => new StoreResource($this->whenLoaded('store')),
            'services' => ServiceResource::collection($this->whenLoaded('services')),
        ];
    }
}
