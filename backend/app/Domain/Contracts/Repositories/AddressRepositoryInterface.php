<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\Address;
use Illuminate\Database\Eloquent\Collection;

interface AddressRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, Address>
     */
    public function byUser(int $userId): Collection;
}
