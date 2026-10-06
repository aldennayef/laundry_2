<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

final class VoucherException extends DomainException
{
    public static function notFound(): self
    {
        return new self('Voucher tidak ditemukan atau tidak valid.', 404);
    }

    public static function inactive(): self
    {
        return new self('Voucher sedang tidak aktif.');
    }

    public static function expired(): self
    {
        return new self('Voucher sudah kedaluwarsa.');
    }

    public static function notStarted(): self
    {
        return new self('Voucher belum dapat digunakan.');
    }

    public static function belowMinimumAmount(float $minAmount): self
    {
        return new self(
            sprintf('Minimal belanja untuk voucher ini adalah Rp %s.', number_format($minAmount, 0, ',', '.')),
        );
    }

    public static function quotaExhausted(): self
    {
        return new self('Kuota voucher sudah habis.');
    }

    public static function userQuotaExceeded(): self
    {
        return new self('Anda sudah mencapai batas maksimal penggunaan voucher ini.');
    }

    public static function tierNotEligible(): self
    {
        return new self('Voucher ini tidak tersedia untuk tier membership Anda.');
    }

    public static function storeNotEligible(): self
    {
        return new self('Voucher ini tidak berlaku pada store yang dipilih.');
    }
}
