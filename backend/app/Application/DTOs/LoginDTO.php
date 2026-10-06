<?php

declare(strict_types=1);

namespace App\Application\DTOs;

final class LoginDTO extends DataTransferObject
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly string $deviceName = 'web',
    ) {
    }

    public static function fromArray(array $data): static
    {
        return new self(
            email: $data['email'],
            password: $data['password'],
            deviceName: $data['device_name'] ?? 'web',
        );
    }
}
