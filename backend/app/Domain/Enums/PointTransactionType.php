<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum PointTransactionType: string
{
    case EARN = 'earn';
    case REDEEM = 'redeem';
    case ADJUST = 'adjust';

    public static function values(): array
    {
        return array_map(static fn (self $type): string => $type->value, self::cases());
    }
}
