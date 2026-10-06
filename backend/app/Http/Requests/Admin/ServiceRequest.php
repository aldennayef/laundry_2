<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

final class ServiceRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'service_category_id' => [$required, 'integer', 'exists:tbl_service_categories,id'],
            'store_id' => [$required, 'integer', 'exists:tbl_stores,id'],
            'service_unit_id' => ['nullable', 'integer', 'exists:tbl_service_unit,id'],
            'service_name' => [$required, 'string', 'max:150'],
            'price' => [$required, 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
