<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceType extends Model
{
    use HasFactory;

    protected $table = 'tbl_service_type';

    protected $fillable = [
        'service_type_name',
        'processing_time',
        'processing_time_unit',
        'price',
    ];

    protected $casts = [
        'processing_time' => 'integer',
        'price' => 'decimal:2',
    ];

    /**
     * @return HasMany<Booking>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'service_type_id');
    }
}
