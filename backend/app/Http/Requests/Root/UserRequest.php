<?php

declare(strict_types=1);

namespace App\Http\Requests\Root;

use App\Domain\Enums\RoleEnum;
use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

final class UserRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $isCreate = $this->isMethod('post');
        $userId = $this->route('user')?->id;

        return [
            'role_id' => [$isCreate ? 'required' : 'sometimes', 'integer', 'exists:tbl_roles,id'],
            'store_id' => ['nullable', 'integer', 'exists:tbl_stores,id'],
            'membership_tier_id' => ['nullable', 'integer', 'exists:tbl_membership_tiers,id'],
            'username' => ['nullable', 'string', 'max:50', 'unique:tbl_users,username'.($userId ? ','.$userId : '')],
            'email' => [$isCreate ? 'required' : 'sometimes', 'email', 'max:150', 'unique:tbl_users,email'.($userId ? ','.$userId : '')],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => [$isCreate ? 'required' : 'nullable', Password::min(8)->letters()->numbers()],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Admins cabang may only create customer/staff within their store.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $roleId = $this->input('role_id');

            if ($roleId === null) {
                return;
            }

            $roleName = \App\Models\Role::query()->whereKey($roleId)->value('role_name');

            if ($roleName === RoleEnum::ROOT->value && ! $this->user()?->isRoot()) {
                $validator->errors()->add('role_id', 'Hanya root yang dapat membuat akun root.');
            }
        });
    }
}
