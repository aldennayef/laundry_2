<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

final class StoreException extends DomainException
{
    public static function notFound(): self
    {
        return new self('Store tidak ditemukan.', 404);
    }

    public static function inactive(): self
    {
        return new self('Store sedang tidak aktif.');
    }

    public static function accessDenied(): self
    {
        return new self('Anda tidak memiliki akses ke store ini.', 403);
    }
}
