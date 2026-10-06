<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\PointTransactionRepositoryInterface;
use App\Models\PointTransaction;
use Illuminate\Database\Eloquent\Collection;

final class PointTransactionRepository extends BaseRepository implements PointTransactionRepositoryInterface
{
    public function __construct(PointTransaction $model)
    {
        parent::__construct($model);
    }

    public function byUser(int $userId): Collection
    {
        return PointTransaction::query()
            ->with('booking')
            ->where('user_id', $userId)
            ->latest('id')
            ->get();
    }

    public function currentBalance(int $userId): int
    {
        return (int) PointTransaction::query()
            ->where('user_id', $userId)
            ->sum('points');
    }

    public function existsForBookingAndType(int $bookingId, string $type): bool
    {
        return PointTransaction::query()
            ->where('booking_id', $bookingId)
            ->where('type', $type)
            ->exists();
    }
}
