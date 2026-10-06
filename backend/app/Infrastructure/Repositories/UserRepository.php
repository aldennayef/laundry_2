<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?User
    {
        return User::query()->with(['role', 'store', 'membershipTier'])->where('email', $email)->first();
    }

    public function emailExists(string $email, ?int $exceptId = null): bool
    {
        return User::query()
            ->where('email', $email)
            ->when($exceptId !== null, fn ($q) => $q->whereKeyNot($exceptId))
            ->exists();
    }

    public function usernameExists(string $username, ?int $exceptId = null): bool
    {
        return User::query()
            ->where('username', $username)
            ->when($exceptId !== null, fn ($q) => $q->whereKeyNot($exceptId))
            ->exists();
    }

    public function findByRole(string $roleName): Collection
    {
        return User::query()
            ->whereHas('role', fn ($q) => $q->where('role_name', $roleName))
            ->get();
    }

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator
    {
        return User::query()
            ->with(['role', 'store', 'membershipTier'])
            ->when($filters['search'] ?? null, function ($q, $search): void {
                $q->where(function ($sub) use ($search): void {
                    $sub->where('email', 'ilike', "%{$search}%")
                        ->orWhere('username', 'ilike', "%{$search}%")
                        ->orWhere('phone', 'ilike', "%{$search}%");
                });
            })
            ->when($filters['role'] ?? null, fn ($q, $role) => $q->whereHas('role', fn ($r) => $r->where('role_name', $role)))
            ->when($filters['store_id'] ?? null, fn ($q, $storeId) => $q->where('store_id', $storeId))
            ->when(isset($filters['is_active']) && $filters['is_active'] !== '', fn ($q) => $q->where('is_active', (bool) $filters['is_active']))
            ->latest('id')
            ->paginate($perPage);
    }
}
