<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

use RuntimeException;
use Throwable;

/**
 * Base exception for all domain/business rule violations.
 *
 * Carries an HTTP status code so the presentation layer can map it
 * to a proper JSON response without leaking infrastructure details.
 */
abstract class DomainException extends RuntimeException
{
    public function __construct(
        string $message,
        private readonly int $httpStatusCode = 422,
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }

    public function httpStatusCode(): int
    {
        return $this->httpStatusCode;
    }
}
