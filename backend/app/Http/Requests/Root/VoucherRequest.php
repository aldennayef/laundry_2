<?php

declare(strict_types=1);

namespace App\Http\Requests\Root;

use App\Domain\Enums\DiscountType;
use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

final class VoucherRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'store_id' => ['nullable', 'integer', 'exists:tbl_stores,id'],
            'membership_tier_id' => ['nullable', 'integer', 'exists:tbl_membership_tiers,id'],
            'service_id' => ['nullable', 'integer', 'exists:tbl_services,id'],
            'code' => [$required, 'string', 'max:50', 'unique:tbl_vouchers,code'.($this->route('voucher') ? ','.$this->route('voucher')->id : '')],
            'discount_type' => [$required, Rule::in(DiscountType::values())],
            'discount_value' => [$required, 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'redeem_quota' => ['nullable', 'integer', 'min:1'],
            'quota_per_user' => ['nullable', 'integer', 'min:1'],
            'point_cost' => ['nullable', 'integer', 'min:0'],
            'start_time' => ['nullable', 'date'],
            'end_time' => ['nullable', 'date', 'after:start_time'],
            'is_active' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string'],
        ];
    }
}
