<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Public;

use App\Domain\Contracts\Repositories\StoreRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use Illuminate\Http\JsonResponse;

final class PublicStoreController extends Controller
{
    public function __construct(
        private readonly StoreRepositoryInterface $stores,
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => StoreResource::collection($this->stores->active()),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $store = $this->stores->findWithRelations($id, ['serviceCategories.services.unit', 'services.unit', 'orderSchedules']);

        abort_if($store === null || ! $store->is_active, 404, 'Store tidak ditemukan.');

        return response()->json(['data' => new StoreResource($store)]);
    }
}
