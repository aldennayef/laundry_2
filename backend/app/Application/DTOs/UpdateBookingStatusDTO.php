<?php

declare(strict_types=1);

namespace App\Application\DTOs;

final class UpdateBookingStatusDTO extends DataTransferObject
{
    public function __construct(
        public readonly int $bookingId,
        public readonly string $status,
        public readonly int $actorId,
        public readonly ?string $note = null,
    ) {
    }

    public static function fromArray(array $data): static
    {
        return new self(
            bookingId: (int) $data['booking_id'],
            status: $data['status'],
            actorId: (int) $data['actor_id'],
            note: $data['note'] ?? null,
        );
    }
}
