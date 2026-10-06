<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface BookingRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, Booking>
     */
    public function byUser(int $userId, array $relations = []): Collection;

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator;

    public function generateBookingCode(): string;

    public function countUserVoucherUsage(int $userId, int $voucherId): int;
}
