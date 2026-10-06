<?php

declare(strict_types=1);

namespace App\Http\Requests\Root;

use App\Http\Requests\BaseFormRequest;

final class LoyaltyRuleRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'store_id' => ['nullable', 'integer', 'exists:tbl_stores,id'],
            'rule_name' => [$required, 'string', 'max:100'],
            'spend_per_point' => [$required, 'numeric', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
