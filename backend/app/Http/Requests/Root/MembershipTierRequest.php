<?php

declare(strict_types=1);

namespace App\Http\Requests\Root;

use App\Http\Requests\BaseFormRequest;

final class MembershipTierRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'tier_name' => [$required, 'string', 'max:50'],
            'min_spend' => [$required, 'numeric', 'min:0'],
            'discount_percent' => [$required, 'numeric', 'min:0', 'max:100'],
            'bonus_point_multiplier' => [$required, 'numeric', 'min:0'],
        ];
    }
}
