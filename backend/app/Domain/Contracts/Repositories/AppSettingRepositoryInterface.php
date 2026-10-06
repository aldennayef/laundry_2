<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\AppSetting;

interface AppSettingRepositoryInterface extends BaseRepositoryInterface
{
    public function current(): ?AppSetting;
}
