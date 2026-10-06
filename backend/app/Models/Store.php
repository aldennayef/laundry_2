<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;

    protected $table = 'tbl_stores';

    protected $fillable = [
        'store_name',
        'phone',
        'whatsapp_number',
        'email',
        'address',
        'city',
        'latitude',
        'longitude',
        'operating_hours',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_active' => 'boolean',
    ];

    /**
     * @return HasMany<ServiceCategory>
     */
    public function serviceCategories(): HasMany
    {
        return $this->hasMany(ServiceCategory::class, 'store_id');
    }

    /**
     * @return HasMany<Service>
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'store_id');
    }

    /**
     * @return HasMany<OrderSchedule>
     */
    public function orderSchedules(): HasMany
    {
        return $this->hasMany(OrderSchedule::class, 'store_id');
    }

    /**
     * @return HasMany<Booking>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'store_id');
    }

    /**
     * @return HasMany<User>
     */
    public function admins(): HasMany
    {
        return $this->hasMany(User::class, 'store_id');
    }

    /**
     * @return HasMany<Voucher>
     */
    public function vouchers(): HasMany
    {
        return $this->hasMany(Voucher::class, 'store_id');
    }

    /**
     * @param  Builder<Store>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }
}
