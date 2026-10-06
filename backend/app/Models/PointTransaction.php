<?php

declare(strict_types=1);

namespace App\Models;

use App\Domain\Enums\PointTransactionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PointTransaction extends Model
{
    use HasFactory;

    protected $table = 'tbl_point_transactions';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'booking_id',
        'type',
        'points',
        'balance_after',
        'note',
    ];

    protected $casts = [
        'type' => PointTransactionType::class,
        'points' => 'integer',
        'balance_after' => 'integer',
        'created_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<User, PointTransaction>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<Booking, PointTransaction>
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }
}
