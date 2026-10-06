<?php

declare(strict_types=1);

namespace App\Application\DTOs;

final class RegisterUserDTO extends DataTransferObject
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $username = null,
        public readonly ?string $phone = null,
    ) {
    }

    public static function fromArray(array $data): static
    {
        return new self(
            email: $data['email'],
            password: $data['password'],
            username: $data['username'] ?? null,
            phone: $data['phone'] ?? null,
        );
    }
}
