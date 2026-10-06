<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRequest;
use App\Http\Resources\StoreResource;
use App\Domain\Contracts\Repositories\StoreRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AdminStoreController extends Controller
{
    public function __construct(
        private readonly StoreRepositoryInterface $stores,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        // Admin cabang hanya melihat store-nya sendiri; root melihat semua.
        if ($request->user()->isAdminCabang()) {
            $store = $this->stores->findById($request->user()->store_id);

            return response()->json(['data' => $store ? [new StoreResource($store)] : []]);
        }

        $stores = $this->stores->paginateFiltered((int) $request->query('per_page', 15), $request->only(['search', 'is_active']));

        return response()->json(['data' => StoreResource::collection($stores)]);
    }

    public function store(StoreRequest $request): JsonResponse
    {
        abort_if($request->user()->isAdminCabang(), 403, 'Admin cabang tidak dapat membuat store.');

        $store = $this->stores->create($request->validated());

        return response()->json(['message' => 'Store dibuat.', 'data' => new StoreResource($store)], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $store = $this->stores->findWithRelations($id, ['services.unit', 'serviceCategories', 'orderSchedules']);

        abort_if($store === null, 404, 'Store tidak ditemukan.');
        abort_if(! $request->user()->canManageStore($store->id), 403, 'Akses ditolak.');

        return response()->json(['data' => new StoreResource($store)]);
    }

    public function update(StoreRequest $request, int $id): JsonResponse
    {
        $store = $this->stores->findByIdOrFail($id);
        abort_if(! $request->user()->canManageStore($store->id), 403, 'Akses ditolak.');

        $store = $this->stores->update($store, $request->validated());

        return response()->json(['message' => 'Store diperbarui.', 'data' => new StoreResource($store)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        abort_if(! $request->user()->isRoot(), 403, 'Akses ditolak.');

        $store = $this->stores->findByIdOrFail($id);
        $this->stores->delete($store);

        return response()->json(['message' => 'Store dihapus.']);
    }
}
