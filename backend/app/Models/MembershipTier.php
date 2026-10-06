<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MembershipTier extends Model
{
    use HasFactory;

    protected $table = 'tbl_membership_tiers';

    protected $fillable = [
        'tier_name',
        'min_spend',
        'discount_percent',
        'bonus_point_multiplier',
    ];

    protected $casts = [
        'min_spend' => 'decimal:2',
        'discount_percent' => 'decimal:2',
        'bonus_point_multiplier' => 'decimal:2',
    ];

    /**
     * @return HasMany<User>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'membership_tier_id');
    }

    /**
     * @return HasMany<Voucher>
     */
    public function vouchers(): HasMany
    {
        return $this->hasMany(Voucher::class, 'membership_tier_id');
    }
}
