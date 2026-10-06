<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Domain\Enums\BookingStatus;
use Illuminate\Validation\Rule;

final class UpdateBookingStatusRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(BookingStatus::values())],
            'note' => ['nullable', 'string'],
        ];
    }
}
