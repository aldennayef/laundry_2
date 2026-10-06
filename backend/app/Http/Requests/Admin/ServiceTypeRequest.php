<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

final class ServiceTypeRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'service_type_name' => [$required, 'string', 'max:100'],
            'processing_time' => [$required, 'integer', 'min:1'],
            'processing_time_unit' => [$required, 'string', 'in:jam,hari'],
            'price' => [$required, 'numeric', 'min:0'],
        ];
    }
}
