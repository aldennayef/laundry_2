<?php

declare(strict_types=1);

namespace App\Models;

use App\Domain\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Booking extends Model
{
    use HasFactory;

    protected $table = 'tbl_bookings';

    protected $fillable = [
        'booking_code',
        'user_id',
        'store_id',
        'service_id',
        'service_type_id',
        'voucher_id',
        'cust_name',
        'cust_phone',
        'cust_address',
        'notes',
        'booking_date',
        'pickup_schedule',
        'delivery_schedule',
        'estimated_amount',
        'service_type_price',
        'discount_amount',
        'final_amount',
        'status',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'pickup_schedule' => 'datetime',
        'delivery_schedule' => 'datetime',
        'estimated_amount' => 'decimal:2',
        'service_type_price' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'status' => BookingStatus::class,
    ];

    /**
     * @return BelongsTo<User, Booking>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<Store, Booking>
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    /**
     * @return BelongsTo<Service, Booking>
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    /**
     * @return BelongsTo<ServiceType, Booking>
     */
    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class, 'service_type_id');
    }

    /**
     * @return BelongsTo<Voucher, Booking>
     */
    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class, 'voucher_id');
    }

    /**
     * @return HasMany<BookingStatusLog>
     */
    public function statusLogs(): HasMany
    {
        return $this->hasMany(BookingStatusLog::class, 'booking_id')->orderBy('id');
    }

    /**
     * @param  Builder<Booking>  $query
     */
    public function scopeForStore(Builder $query, int $storeId): void
    {
        $query->where('store_id', $storeId);
    }
}
