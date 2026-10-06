<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function emailExists(string $email, ?int $exceptId = null): bool;

    public function usernameExists(string $username, ?int $exceptId = null): bool;

    public function findByRole(string $roleName): Collection;

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator;
}
