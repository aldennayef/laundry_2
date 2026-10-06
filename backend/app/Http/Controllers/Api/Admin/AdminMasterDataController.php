<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Domain\Contracts\Repositories\ServiceTypeRepositoryInterface;
use App\Domain\Contracts\Repositories\ServiceUnitRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceTypeRequest;
use App\Http\Requests\Admin\ServiceUnitRequest;
use App\Http\Resources\ServiceTypeResource;
use App\Http\Resources\ServiceUnitResource;
use Illuminate\Http\JsonResponse;

/**
 * Global master data (units & service types) shared across stores.
 */
final class AdminMasterDataController extends Controller
{
    public function __construct(
        private readonly ServiceUnitRepositoryInterface $units,
        private readonly ServiceTypeRepositoryInterface $serviceTypes,
    ) {
    }

    public function units(): JsonResponse
    {
        return response()->json(['data' => ServiceUnitResource::collection($this->units->all())]);
    }

    public function storeUnit(ServiceUnitRequest $request): JsonResponse
    {
        $unit = $this->units->create($request->validated());

        return response()->json(['message' => 'Satuan dibuat.', 'data' => new ServiceUnitResource($unit)], 201);
    }

    public function updateUnit(ServiceUnitRequest $request, int $id): JsonResponse
    {
        $unit = $this->units->update($this->units->findByIdOrFail($id), $request->validated());

        return response()->json(['message' => 'Satuan diperbarui.', 'data' => new ServiceUnitResource($unit)]);
    }

    public function destroyUnit(int $id): JsonResponse
    {
        $this->units->delete($this->units->findByIdOrFail($id));

        return response()->json(['message' => 'Satuan dihapus.']);
    }

    public function serviceTypes(): JsonResponse
    {
        return response()->json(['data' => ServiceTypeResource::collection($this->serviceTypes->all())]);
    }

    public function storeServiceType(ServiceTypeRequest $request): JsonResponse
    {
        $type = $this->serviceTypes->create($request->validated());

        return response()->json(['message' => 'Tipe layanan dibuat.', 'data' => new ServiceTypeResource($type)], 201);
    }

    public function updateServiceType(ServiceTypeRequest $request, int $id): JsonResponse
    {
        $type = $this->serviceTypes->update($this->serviceTypes->findByIdOrFail($id), $request->validated());

        return response()->json(['message' => 'Tipe layanan diperbarui.', 'data' => new ServiceTypeResource($type)]);
    }

    public function destroyServiceType(int $id): JsonResponse
    {
        $this->serviceTypes->delete($this->serviceTypes->findByIdOrFail($id));

        return response()->json(['message' => 'Tipe layanan dihapus.']);
    }
}
