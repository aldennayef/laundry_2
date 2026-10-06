<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

final class FaqCategoryRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_name' => [$this->isMethod('post') ? 'required' : 'sometimes', 'string', 'max:100'],
        ];
    }
}
