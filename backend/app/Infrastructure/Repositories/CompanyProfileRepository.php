<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\CompanyProfileRepositoryInterface;
use App\Models\CompanyProfile;

final class CompanyProfileRepository extends BaseRepository implements CompanyProfileRepositoryInterface
{
    public function __construct(CompanyProfile $model)
    {
        parent::__construct($model);
    }

    public function current(): ?CompanyProfile
    {
        return CompanyProfile::query()->latest('id')->first();
    }
}
