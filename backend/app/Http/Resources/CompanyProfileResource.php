<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\CompanyProfile
 */
final class CompanyProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'description' => $this->description,
            'vision' => $this->vision,
            'mission' => $this->mission,
            'logo_url' => $this->logo_path ? asset('storage/'.$this->logo_path) : null,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'social_media' => $this->social_media,
        ];
    }
}
