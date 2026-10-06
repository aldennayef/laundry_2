<?php

declare(strict_types=1);

namespace App\Application\DTOs;

use Illuminate\Contracts\Support\Arrayable;

/**
 * Base class for immutable application DTOs.
 */
abstract class DataTransferObject implements Arrayable
{
    /**
     * Build the DTO from a validated request payload.
     *
     * @param  array<string, mixed>  $data
     */
    abstract public static function fromArray(array $data): static;

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
