<?php

declare(strict_types=1);

namespace App\Models;

use App\Domain\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingStatusLog extends Model
{
    use HasFactory;

    protected $table = 'tbl_booking_status_logs';

    public $timestamps = false;

    protected $fillable = [
        'booking_id',
        'status',
        'note',
        'changed_by',
    ];

    protected $casts = [
        'status' => BookingStatus::class,
        'created_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<Booking, BookingStatusLog>
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    /**
     * @return BelongsTo<User, BookingStatusLog>
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
