<?php

declare(strict_types=1);

namespace App\Http\Requests\Root;

use App\Domain\Enums\MapsProvider;
use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

final class AppSettingRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:150'],
            'title' => ['nullable', 'string', 'max:150'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'currency' => ['nullable', 'string', 'max:10'],
            'service_fee_type' => ['nullable', 'string', 'in:fixed,percent'],
            'service_fee_value' => ['nullable', 'numeric', 'min:0'],
            'tax_type' => ['nullable', 'string', 'in:fixed,percent'],
            'tax_value' => ['nullable', 'numeric', 'min:0'],
            'include_service_fee' => ['nullable', 'boolean'],
            'maps_provider' => ['nullable', Rule::in(MapsProvider::values())],
            'maps_api_key' => ['nullable', 'string', 'max:255'],
            'maps_default_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'maps_default_lng' => ['nullable', 'numeric', 'between:-180,180'],
            'maps_zoom' => ['nullable', 'integer', 'between:1,22'],
        ];
    }
}
