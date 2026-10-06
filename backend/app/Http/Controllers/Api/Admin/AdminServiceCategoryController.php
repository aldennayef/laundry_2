<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Domain\Contracts\Repositories\ServiceCategoryRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceCategoryRequest;
use App\Http\Resources\ServiceCategoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AdminServiceCategoryController extends Controller
{
    public function __construct(
        private readonly ServiceCategoryRepositoryInterface $categories,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $storeId = $this->resolveStoreId($request);

        return response()->json([
            'data' => ServiceCategoryResource::collection($this->categories->byStore($storeId, ['services'])),
        ]);
    }

    public function store(ServiceCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->authorizeStore($request, (int) $data['store_id']);

        $category = $this->categories->create($data);

        return response()->json(['message' => 'Kategori dibuat.', 'data' => new ServiceCategoryResource($category)], 201);
    }

    public function update(ServiceCategoryRequest $request, int $id): JsonResponse
    {
        $category = $this->categories->findByIdOrFail($id);
        $this->authorizeStore($request, $category->store_id);

        $category = $this->categories->update($category, $request->validated());

        return response()->json(['message' => 'Kategori diperbarui.', 'data' => new ServiceCategoryResource($category)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $category = $this->categories->findByIdOrFail($id);
        $this->authorizeStore($request, $category->store_id);
        $this->categories->delete($category);

        return response()->json(['message' => 'Kategori dihapus.']);
    }

    private function resolveStoreId(Request $request): int
    {
        return $request->user()->isAdminCabang()
            ? (int) $request->user()->store_id
            : (int) $request->query('store_id', 0);
    }

    private function authorizeStore(Request $request, int $storeId): void
    {
        abort_if(! $request->user()->canManageStore($storeId), 403, 'Akses ditolak.');
    }
}
