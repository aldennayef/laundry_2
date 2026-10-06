<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum DiscountType: string
{
    case FIXED = 'fixed';
    case PERCENT = 'percent';

    public static function values(): array
    {
        return array_map(static fn (self $type): string => $type->value, self::cases());
    }
}
