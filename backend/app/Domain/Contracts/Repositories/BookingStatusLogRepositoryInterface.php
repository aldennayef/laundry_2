<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\BookingStatusLog;
use Illuminate\Database\Eloquent\Collection;

interface BookingStatusLogRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, BookingStatusLog>
     */
    public function byBooking(int $bookingId): Collection;
}
