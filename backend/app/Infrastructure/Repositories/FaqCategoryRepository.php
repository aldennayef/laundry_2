<?php

declare(strict_types=1);

namespace App\Infrastructure\Repositories;

use App\Domain\Contracts\Repositories\FaqCategoryRepositoryInterface;
use App\Models\FaqCategory;

final class FaqCategoryRepository extends BaseRepository implements FaqCategoryRepositoryInterface
{
    public function __construct(FaqCategory $model)
    {
        parent::__construct($model);
    }
}
