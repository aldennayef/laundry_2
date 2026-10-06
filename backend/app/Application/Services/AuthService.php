<?php

declare(strict_types=1);

namespace App\Application\Services;

use App\Application\DTOs\LoginDTO;
use App\Application\DTOs\RegisterUserDTO;
use App\Domain\Contracts\Repositories\UserRepositoryInterface;
use App\Domain\Enums\RoleEnum;
use App\Domain\Exceptions\AuthException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

final class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly TierService $tiers,
    ) {
    }

    /**
     * Register a new customer account.
     *
     * @return array{user: User, token: string}
     */
    public function register(RegisterUserDTO $dto): array
    {
        $roleId = $this->resolveCustomerRoleId();

        $user = $this->users->create([
            'role_id' => $roleId,
            'store_id' => null,
            'membership_tier_id' => $this->tiers->resolveTierIdForSpend(0.0),
            'username' => $dto->username,
            'email' => $dto->email,
            'phone' => $dto->phone,
            'password' => Hash::make($dto->password),
            'balance' => 0,
            'total_spend' => 0,
            'is_active' => true,
        ]);

        $user->load(['role', 'store', 'membershipTier']);

        return ['user' => $user, 'token' => $this->issueToken($user)];
    }

    /**
     * Authenticate a user and issue a Sanctum token.
     *
     * @return array{user: User, token: string}
     */
    public function login(LoginDTO $dto): array
    {
        /** @var User|null $user */
        $user = $this->users->findByEmail($dto->email);

        if ($user === null || ! Hash::check($dto->password, $user->password)) {
            throw AuthException::invalidCredentials();
        }

        if (! $user->is_active) {
            throw AuthException::inactiveAccount();
        }

        return ['user' => $user, 'token' => $this->issueToken($user, $dto->deviceName)];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    private function issueToken(User $user, string $deviceName = 'web'): string
    {
        return $user->createToken($deviceName)->plainTextToken;
    }

    private function resolveCustomerRoleId(): int
    {
        return (int) \App\Models\Role::query()
            ->where('role_name', RoleEnum::CUSTOMER->value)
            ->value('id');
    }
}
