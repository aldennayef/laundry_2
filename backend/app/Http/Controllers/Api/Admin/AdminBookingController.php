<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Application\DTOs\UpdateBookingStatusDTO;
use App\Application\Services\BookingService;
use App\Domain\Contracts\Repositories\BookingRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Http\Resources\BookingResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AdminBookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookings,
        private readonly BookingRepositoryInterface $repo,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status']);
        if ($request->user()->isAdminCabang()) {
            $filters['store_id'] = $request->user()->store_id;
        } elseif ($request->filled('store_id')) {
            $filters['store_id'] = $request->query('store_id');
        }

        $bookings = $this->repo->paginateFiltered((int) $request->query('per_page', 15), $filters);

        return response()->json(['data' => BookingResource::collection($bookings)]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $booking = $this->repo->findByIdOrFail($id)->load(['store', 'service', 'serviceType', 'voucher', 'user', 'statusLogs.changedBy']);

        abort_if(! $request->user()->canManageStore($booking->store_id), 403, 'Akses ditolak.');

        return response()->json(['data' => new BookingResource($booking)]);
    }

    public function updateStatus(UpdateBookingStatusRequest $request, int $id): JsonResponse
    {
        $booking = $this->repo->findByIdOrFail($id);
        abort_if(! $request->user()->canManageStore($booking->store_id), 403, 'Akses ditolak.');

        $dto = UpdateBookingStatusDTO::fromArray([
            ...$request->validated(),
            'booking_id' => $id,
            'actor_id' => $request->user()->id,
        ]);

        $booking = $this->bookings->updateStatus($dto, $request->user());

        return response()->json(['message' => 'Status booking diperbarui.', 'data' => new BookingResource($booking)]);
    }
}
