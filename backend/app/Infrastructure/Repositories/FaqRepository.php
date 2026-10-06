<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\FaqRepositoryInterface;
use App\Models\Faq;
use Illuminate\Database\Eloquent\Collection;

final class FaqRepository extends BaseRepository implements FaqRepositoryInterface
{
    public function __construct(Faq $model)
    {
        parent::__construct($model);
    }

    public function activeOrdered(): Collection
    {
        return Faq::query()
            ->with('category')
            ->active()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }
}
