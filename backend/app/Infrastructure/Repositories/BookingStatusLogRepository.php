<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\BookingStatusLogRepositoryInterface;
use App\Models\BookingStatusLog;
use Illuminate\Database\Eloquent\Collection;

final class BookingStatusLogRepository extends BaseRepository implements BookingStatusLogRepositoryInterface
{
    public function __construct(BookingStatusLog $model)
    {
        parent::__construct($model);
    }

    public function byBooking(int $bookingId): Collection
    {
        return BookingStatusLog::query()
            ->with('changedBy')
            ->where('booking_id', $bookingId)
            ->orderBy('id')
            ->get();
    }
}
