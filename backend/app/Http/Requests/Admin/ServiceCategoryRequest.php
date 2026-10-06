<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

final class ServiceCategoryRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'store_id' => [$required, 'integer', 'exists:tbl_stores,id'],
            'category_name' => [$required, 'string', 'max:100'],
            'description' => ['nullable', 'string'],
        ];
    }
}
