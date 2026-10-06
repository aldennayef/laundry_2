<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\AddressRepositoryInterface;
use App\Models\Address;
use Illuminate\Database\Eloquent\Collection;

final class AddressRepository extends BaseRepository implements AddressRepositoryInterface
{
    public function __construct(Address $model)
    {
        parent::__construct($model);
    }

    public function byUser(int $userId): Collection
    {
        return Address::query()
            ->where('user_id', $userId)
            ->orderByDesc('is_default')
            ->latest('id')
            ->get();
    }
}
