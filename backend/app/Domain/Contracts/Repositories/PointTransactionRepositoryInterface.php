<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\PointTransaction;
use Illuminate\Database\Eloquent\Collection;

interface PointTransactionRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, PointTransaction>
     */
    public function byUser(int $userId): Collection;

    public function currentBalance(int $userId): int;

    public function existsForBookingAndType(int $bookingId, string $type): bool;
}
