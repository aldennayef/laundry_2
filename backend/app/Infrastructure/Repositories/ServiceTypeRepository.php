<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\ServiceTypeRepositoryInterface;
use App\Models\ServiceType;

final class ServiceTypeRepository extends BaseRepository implements ServiceTypeRepositoryInterface
{
    public function __construct(ServiceType $model)
    {
        parent::__construct($model);
    }
}
