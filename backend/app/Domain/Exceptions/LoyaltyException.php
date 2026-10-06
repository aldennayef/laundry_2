<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

final class LoyaltyException extends DomainException
{
    public static function insufficientPoints(int $available, int $required): self
    {
        return new self(
            sprintf('Poin tidak cukup. Tersedia %d, dibutuhkan %d.', $available, $required),
        );
    }

    public static function inactiveRule(): self
    {
        return new self('Aturan loyalty untuk operasi ini sedang tidak aktif.');
    }
}
