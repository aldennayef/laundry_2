<?php

declare(strict_types=1);

namespace App\Http\Requests;

final class RedeemVoucherRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'voucher_id' => ['required', 'integer', 'exists:tbl_vouchers,id'],
        ];
    }
}
