<?php

declare(strict_types=1);

namespace App\Models;

use App\Domain\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $table = 'tbl_roles';

    protected $fillable = ['role_name'];

    /**
     * @return HasMany<User>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role_id');
    }

    public function isRoot(): bool
    {
        return $this->role_name === RoleEnum::ROOT->value;
    }
}
