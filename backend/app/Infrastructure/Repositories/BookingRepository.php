<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\BookingRepositoryInterface;
use App\Models\Booking;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

final class BookingRepository extends BaseRepository implements BookingRepositoryInterface
{
    public function __construct(Booking $model)
    {
        parent::__construct($model);
    }

    public function byUser(int $userId, array $relations = []): Collection
    {
        return Booking::query()
            ->with($relations)
            ->where('user_id', $userId)
            ->latest('id')
            ->get();
    }

    public function paginateFiltered(int $perPage, array $filters = []): LengthAwarePaginator
    {
        return Booking::query()
            ->with(['store', 'service', 'serviceType', 'voucher', 'user'])
            ->when($filters['store_id'] ?? null, fn ($q, $storeId) => $q->where('store_id', $storeId))
            ->when($filters['user_id'] ?? null, fn ($q, $userId) => $q->where('user_id', $userId))
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->when($filters['search'] ?? null, function ($q, $search): void {
                $q->where(function ($sub) use ($search): void {
                    $sub->where('booking_code', 'ilike', "%{$search}%")
                        ->orWhere('cust_name', 'ilike', "%{$search}%")
                        ->orWhere('cust_phone', 'ilike', "%{$search}%");
                });
            })
            ->latest('id')
            ->paginate($perPage);
    }

    public function generateBookingCode(): string
    {
        do {
            $code = sprintf('WS-%s-%s', now()->format('Ymd'), Str::upper(Str::random(6)));
        } while (Booking::query()->where('booking_code', $code)->exists());

        return $code;
    }

    public function countUserVoucherUsage(int $userId, int $voucherId): int
    {
        return Booking::query()
            ->where('user_id', $userId)
            ->where('voucher_id', $voucherId)
            ->whereNotIn('status', ['cancelled'])
            ->count();
    }
}
