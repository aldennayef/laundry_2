<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\AppSettingRepositoryInterface;
use App\Models\AppSetting;

final class AppSettingRepository extends BaseRepository implements AppSettingRepositoryInterface
{
    public function __construct(AppSetting $model)
    {
        parent::__construct($model);
    }

    public function current(): ?AppSetting
    {
        return AppSetting::query()->latest('id')->first();
    }
}
