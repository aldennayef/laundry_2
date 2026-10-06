<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum RoleEnum: string
{
    case ROOT = 'root';
    case ADMIN_CABANG = 'admin_cabang';
    case CUSTOMER = 'customer';

    /**
     * Roles that operate on a specific store.
     */
    public function isStoreScoped(): bool
    {
        return $this === self::ADMIN_CABANG;
    }

    public function label(): string
    {
        return match ($this) {
            self::ROOT => 'Root',
            self::ADMIN_CABANG => 'Admin Cabang',
            self::CUSTOMER => 'Customer',
        };
    }

    public static function values(): array
    {
        return array_map(static fn (self $role): string => $role->value, self::cases());
    }
}
