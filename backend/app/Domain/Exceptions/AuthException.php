<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

final class AuthException extends DomainException
{
    public static function invalidCredentials(): self
    {
        return new self('Email atau password salah.', 401);
    }

    public static function inactiveAccount(): self
    {
        return new self('Akun Anda sedang tidak aktif. Hubungi admin.', 403);
    }

    public static function unauthenticated(): self
    {
        return new self('Silakan login terlebih dahulu.', 401);
    }
}
