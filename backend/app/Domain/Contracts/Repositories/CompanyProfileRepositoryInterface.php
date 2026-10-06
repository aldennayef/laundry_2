<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\CompanyProfile;

interface CompanyProfileRepositoryInterface extends BaseRepositoryInterface
{
    public function current(): ?CompanyProfile;
}
