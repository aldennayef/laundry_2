<?php

declare(strict_types=1);

namespace App\Models;

use App\Domain\Enums\VoucherRedemptionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoucherRedemption extends Model
{
    use HasFactory;

    protected $table = 'tbl_voucher_redemptions';

    protected $fillable = [
        'user_id',
        'voucher_id',
        'points_used',
        'redeemed_at',
        'used_at',
        'status',
    ];

    protected $casts = [
        'points_used' => 'integer',
        'redeemed_at' => 'datetime',
        'used_at' => 'datetime',
        'status' => VoucherRedemptionStatus::class,
    ];

    /**
     * @return BelongsTo<User, VoucherRedemption>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<Voucher, VoucherRedemption>
     */
    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class, 'voucher_id');
    }
}
