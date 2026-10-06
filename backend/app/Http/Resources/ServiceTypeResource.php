<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\ServiceType
 */
final class ServiceTypeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service_type_name' => $this->service_type_name,
            'processing_time' => $this->processing_time,
            'processing_time_unit' => $this->processing_time_unit,
            'price' => (float) $this->price,
        ];
    }
}
