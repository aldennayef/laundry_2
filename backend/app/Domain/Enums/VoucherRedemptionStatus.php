<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum VoucherRedemptionStatus: string
{
    case ACTIVE = 'active';
    case USED = 'used';
    case EXPIRED = 'expired';

    public static function values(): array
    {
        return array_map(static fn (self $status): string => $status->value, self::cases());
    }
}
