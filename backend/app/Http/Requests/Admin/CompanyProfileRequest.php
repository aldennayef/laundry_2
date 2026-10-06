<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

final class CompanyProfileRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'company_name' => [$this->isMethod('post') ? 'required' : 'sometimes', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'vision' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'email' => ['nullable', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'social_media' => ['nullable', 'array'],
            'social_media.*' => ['nullable', 'string', 'max:255'],
        ];
    }
}
