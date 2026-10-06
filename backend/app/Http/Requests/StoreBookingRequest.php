<?php

declare(strict_types=1);

namespace App\Http\Requests;

final class StoreBookingRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'store_id' => ['required', 'integer', 'exists:tbl_stores,id'],
            'service_id' => ['required', 'integer', 'exists:tbl_services,id'],
            'service_type_id' => ['nullable', 'integer', 'exists:tbl_service_type,id'],
            'voucher_id' => ['nullable', 'integer', 'exists:tbl_vouchers,id'],
            'cust_name' => ['required', 'string', 'max:150'],
            'cust_phone' => ['required', 'string', 'max:30'],
            'cust_address' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'booking_date' => ['required', 'date', 'after_or_equal:today'],
            'pickup_schedule' => ['nullable', 'date'],
            'delivery_schedule' => ['nullable', 'date', 'after_or_equal:pickup_schedule'],
        ];
    }
}
