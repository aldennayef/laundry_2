<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

use App\Domain\Enums\BookingStatus;

final class BookingException extends DomainException
{
    public static function invalidStatusTransition(BookingStatus $from, BookingStatus $to): self
    {
        return new self(
            sprintf('Status booking tidak dapat diubah dari "%s" ke "%s".', $from->label(), $to->label()),
        );
    }

    public static function notFound(): self
    {
        return new self('Booking tidak ditemukan.', 404);
    }

    public static function alreadyFinal(): self
    {
        return new self('Booking sudah berstatus final dan tidak dapat diubah lagi.');
    }

    public static function serviceNotBelongToStore(): self
    {
        return new self('Layanan yang dipilih tidak tersedia pada store ini.');
    }
}
