<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Customer;

use App\Application\DTOs\CreateBookingDTO;
use App\Application\Services\BookingService;
use App\Domain\Contracts\Repositories\BookingRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CustomerBookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookings,
        private readonly BookingRepositoryInterface $repo,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $bookings = $this->repo->byUser(
            $request->user()->id,
            ['store', 'service', 'serviceType', 'voucher', 'statusLogs.changedBy'],
        );

        return response()->json(['data' => BookingResource::collection($bookings)]);
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $dto = CreateBookingDTO::fromArray([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        $booking = $this->bookings->create($dto);

        return response()->json([
            'message' => 'Booking berhasil dibuat.',
            'data' => new BookingResource($booking),
        ], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $booking = $this->repo->findById($id);

        abort_if(
            $booking === null || $booking->user_id !== $request->user()->id,
            404,
            'Booking tidak ditemukan.',
        );

        $booking->load(['store', 'service', 'serviceType', 'voucher', 'statusLogs.changedBy']);

        return response()->json(['data' => new BookingResource($booking)]);
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $booking = $this->repo->findByIdOrFail($id);
        $booking = $this->bookings->cancelByCustomer($booking, $request->user());

        return response()->json([
            'message' => 'Booking dibatalkan.',
            'data' => new BookingResource($booking),
        ]);
    }
}
