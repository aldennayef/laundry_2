<?php

declare(strict_types=1);

namespace App\Domain\Contracts\Repositories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Collection;

interface FaqRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @return Collection<int, Faq>
     */
    public function activeOrdered(): Collection;
}
