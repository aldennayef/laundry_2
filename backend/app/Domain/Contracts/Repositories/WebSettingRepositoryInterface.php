<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\WebSetting;
use Illuminate\Database\Eloquent\Collection;

interface WebSettingRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, WebSetting>
     */
    public function allKeyed(): Collection;

    /**
     * @param  array<string, mixed>  $values
     */
    public function upsertMany(array $values, string $group = 'general'): void;
}
