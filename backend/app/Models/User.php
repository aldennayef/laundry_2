<?php

declare(strict_types=1);

namespace App\Models;

use App\Domain\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;

    protected $table = 'tbl_users';

    protected $fillable = [
        'role_id',
        'store_id',
        'membership_tier_id',
        'username',
        'email',
        'phone',
        'password',
        'balance',
        'total_spend',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'total_spend' => 'decimal:2',
        'is_active' => 'boolean',
        'password' => 'hashed',
    ];

    /**
     * @return BelongsTo<Role, User>
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * @return BelongsTo<Store, User>
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    /**
     * @return BelongsTo<MembershipTier, User>
     */
    public function membershipTier(): BelongsTo
    {
        return $this->belongsTo(MembershipTier::class, 'membership_tier_id');
    }

    /**
     * @return HasMany<Address>
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class, 'user_id');
    }

    /**
     * @return HasMany<Booking>
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'user_id');
    }

    /**
     * @return HasMany<PointTransaction>
     */
    public function pointTransactions(): HasMany
    {
        return $this->hasMany(PointTransaction::class, 'user_id');
    }

    /**
     * @return HasMany<VoucherRedemption>
     */
    public function voucherRedemptions(): HasMany
    {
        return $this->hasMany(VoucherRedemption::class, 'user_id');
    }

    /**
     * @return HasMany<Article>
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'author_id');
    }

    public function hasRole(RoleEnum $role): bool
    {
        return $this->role?->role_name === $role->value;
    }

    public function isRoot(): bool
    {
        return $this->hasRole(RoleEnum::ROOT);
    }

    public function isAdminCabang(): bool
    {
        return $this->hasRole(RoleEnum::ADMIN_CABANG);
    }

    public function isCustomer(): bool
    {
        return $this->hasRole(RoleEnum::CUSTOMER);
    }

    /**
     * Whether the user may manage resources belonging to the given store.
     */
    public function canManageStore(?int $storeId): bool
    {
        if ($this->isRoot()) {
            return true;
        }

        return $this->isAdminCabang() && $this->store_id !== null && $this->store_id === $storeId;
    }
}
