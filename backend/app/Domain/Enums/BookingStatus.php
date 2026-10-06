<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum BookingStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case PICKED_UP = 'picked_up';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu Konfirmasi',
            self::CONFIRMED => 'Dikonfirmasi',
            self::PICKED_UP => 'Dijemput',
            self::IN_PROGRESS => 'Diproses',
            self::COMPLETED => 'Selesai',
            self::DELIVERED => 'Diantar',
            self::CANCELLED => 'Dibatalkan',
        };
    }

    /**
     * Whether this status marks the booking as fully finished.
     */
    public function isFinal(): bool
    {
        return in_array($this, [self::DELIVERED, self::CANCELLED], true);
    }

    /**
     * Whether this status means the order is paid/completed and points may be awarded.
     */
    public function isPointEligible(): bool
    {
        return $this === self::COMPLETED || $this === self::DELIVERED;
    }

    /**
     * Allowed next statuses from the current one (state machine).
     *
     * @return array<int, BookingStatus>
     */
    public function nextStatuses(): array
    {
        return match ($this) {
            self::PENDING => [self::CONFIRMED, self::CANCELLED],
            self::CONFIRMED => [self::PICKED_UP, self::CANCELLED],
            self::PICKED_UP => [self::IN_PROGRESS, self::CANCELLED],
            self::IN_PROGRESS => [self::COMPLETED, self::CANCELLED],
            self::COMPLETED => [self::DELIVERED],
            self::DELIVERED, self::CANCELLED => [],
        };
    }

    public function canTransitionTo(self $target): bool
    {
        return in_array($target, $this->nextStatuses(), true);
    }

    public static function values(): array
    {
        return array_map(static fn (self $status): string => $status->value, self::cases());
    }
}
