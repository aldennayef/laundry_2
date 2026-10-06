<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Domain\Contracts\Repositories\OrderScheduleRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OrderScheduleRequest;
use App\Http\Resources\OrderScheduleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AdminScheduleController extends Controller
{
    public function __construct(
        private readonly OrderScheduleRepositoryInterface $schedules,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $storeId = $request->user()->isAdminCabang()
            ? (int) $request->user()->store_id
            : (int) $request->query('store_id', 0);

        abort_if($storeId === 0, 422, 'Parameter store_id wajib diisi.');

        return response()->json(['data' => OrderScheduleResource::collection($this->schedules->byStore($storeId))]);
    }

    public function store(OrderScheduleRequest $request): JsonResponse
    {
        $data = $request->validated();
        abort_if(! $request->user()->canManageStore((int) $data['store_id']), 403, 'Akses ditolak.');

        return response()->json(['message' => 'Jadwal dibuat.', 'data' => new OrderScheduleResource($this->schedules->create($data))], 201);
    }

    public function update(OrderScheduleRequest $request, int $id): JsonResponse
    {
        $schedule = $this->schedules->findByIdOrFail($id);
        abort_if(! $request->user()->canManageStore($schedule->store_id), 403, 'Akses ditolak.');

        $schedule = $this->schedules->update($schedule, $request->validated());

        return response()->json(['message' => 'Jadwal diperbarui.', 'data' => new OrderScheduleResource($schedule)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $schedule = $this->schedules->findByIdOrFail($id);
        abort_if(! $request->user()->canManageStore($schedule->store_id), 403, 'Akses ditolak.');

        $this->schedules->delete($schedule);

        return response()->json(['message' => 'Jadwal dihapus.']);
    }
}
