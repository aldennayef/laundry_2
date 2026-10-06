<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\WebSettingRepositoryInterface;
use App\Models\WebSetting;
use Illuminate\Database\Eloquent\Collection;

final class WebSettingRepository extends BaseRepository implements WebSettingRepositoryInterface
{
    public function __construct(WebSetting $model)
    {
        parent::__construct($model);
    }

    public function allKeyed(): Collection
    {
        return WebSetting::query()->orderBy('group_name')->orderBy('key')->get();
    }

    public function upsertMany(array $values, string $group = 'general'): void
    {
        foreach ($values as $key => $value) {
            WebSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : (string) $value, 'group_name' => $group],
            );
        }
    }
}
