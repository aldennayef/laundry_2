<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Public;

use App\Domain\Contracts\Repositories\ServiceRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PublicCatalogController extends Controller
{
    public function __construct(
        private readonly ServiceRepositoryInterface $services,
    ) {
    }

    public function services(Request $request): JsonResponse
    {
        $storeId = (int) $request->query('store_id', 0);
        abort_if($storeId === 0, 422, 'Parameter store_id wajib diisi.');

        $services = $this->services->activeByStore($storeId, ['category', 'unit', 'store']);

        return response()->json(['data' => ServiceResource::collection($services)]);
    }
}
