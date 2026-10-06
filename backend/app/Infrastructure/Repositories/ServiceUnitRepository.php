<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\ServiceUnitRepositoryInterface;
use App\Models\ServiceUnit;

final class ServiceUnitRepository extends BaseRepository implements ServiceUnitRepositoryInterface
{
    public function __construct(ServiceUnit $model)
    {
        parent::__construct($model);
    }
}
