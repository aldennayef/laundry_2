<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Domain\Contracts\Repositories\ServiceRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceRequest;
use App\Http\Resources\ServiceResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AdminServiceController extends Controller
{
    public function __construct(
        private readonly ServiceRepositoryInterface $services,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'is_active', 'service_category_id']);
        $filters['store_id'] = $request->user()->isAdminCabang()
            ? $request->user()->store_id
            : $request->query('store_id');

        $services = $this->services->paginateFiltered((int) $request->query('per_page', 15), $filters);

        return response()->json(['data' => ServiceResource::collection($services)]);
    }

    public function store(ServiceRequest $request): JsonResponse
    {
        $data = $request->validated();
        abort_if(! $request->user()->canManageStore((int) $data['store_id']), 403, 'Akses ditolak.');

        $service = $this->services->create($data);

        return response()->json(['message' => 'Layanan dibuat.', 'data' => new ServiceResource($service->load(['category', 'store', 'unit']))], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $service = $this->services->findByIdOrFail($id)->load(['category', 'store', 'unit']);
        abort_if(! $request->user()->canManageStore($service->store_id), 403, 'Akses ditolak.');

        return response()->json(['data' => new ServiceResource($service)]);
    }

    public function update(ServiceRequest $request, int $id): JsonResponse
    {
        $service = $this->services->findByIdOrFail($id);
        abort_if(! $request->user()->canManageStore($service->store_id), 403, 'Akses ditolak.');

        $service = $this->services->update($service, $request->validated());

        return response()->json(['message' => 'Layanan diperbarui.', 'data' => new ServiceResource($service->load(['category', 'store', 'unit']))]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $service = $this->services->findByIdOrFail($id);
        abort_if(! $request->user()->canManageStore($service->store_id), 403, 'Akses ditolak.');

        $this->services->delete($service);

        return response()->json(['message' => 'Layanan dihapus.']);
    }
}
