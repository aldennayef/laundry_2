<?php

declare(strict_types=1);

namespace App\Application\DTOs;

final class RedeemVoucherDTO extends DataTransferObject
{
    public function __construct(
        public readonly int $userId,
        public readonly int $voucherId,
    ) {
    }

    public static function fromArray(array $data): static
    {
        return new self(
            userId: (int) $data['user_id'],
            voucherId: (int) $data['voucher_id'],
        );
    }
}
