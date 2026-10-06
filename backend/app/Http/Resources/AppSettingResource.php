<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\AppSetting
 */
final class AppSettingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'title' => $this->title,
            'logo_url' => $this->logo_path ? asset('storage/'.$this->logo_path) : null,
            'favicon_url' => $this->favicon_path ? asset('storage/'.$this->favicon_path) : null,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'currency' => $this->currency,
            'service_fee_type' => $this->service_fee_type,
            'service_fee_value' => (float) $this->service_fee_value,
            'tax_type' => $this->tax_type,
            'tax_value' => (float) $this->tax_value,
            'include_service_fee' => $this->include_service_fee,
            'maps' => [
                'provider' => $this->maps_provider->value,
                'provider_label' => $this->maps_provider->label(),
                'requires_api_key' => $this->maps_provider->requiresApiKey(),
                'api_key' => $this->when($request->user()?->isRoot(), $this->maps_api_key),
                'default_lat' => $this->maps_default_lat !== null ? (float) $this->maps_default_lat : null,
                'default_lng' => $this->maps_default_lng !== null ? (float) $this->maps_default_lng : null,
                'zoom' => $this->maps_zoom,
            ],
        ];
    }
}
