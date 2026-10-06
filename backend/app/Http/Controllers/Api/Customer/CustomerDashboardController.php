<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Customer;

use App\Application\Services\LoyaltyService;
use App\Domain\Contracts\Repositories\BookingRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CustomerDashboardController extends Controller
{
    public function __construct(
        private readonly BookingRepositoryInterface $bookings,
        private readonly LoyaltyService $loyalty,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user()->load(['role', 'store', 'membershipTier']);
        $bookings = $this->bookings->byUser($user->id, ['store', 'service', 'serviceType', 'voucher']);

        return response()->json([
            'data' => [
                'profile' => new UserResource($user),
                'loyalty_balance' => $this->loyalty->currentBalance($user->id),
                'total_bookings' => $bookings->count(),
                'active_bookings' => $bookings->whereIn('status', [
                    \App\Domain\Enums\BookingStatus::PENDING,
                    \App\Domain\Enums\BookingStatus::CONFIRMED,
                    \App\Domain\Enums\BookingStatus::PICKED_UP,
                    \App\Domain\Enums\BookingStatus::IN_PROGRESS,
                ])->count(),
                'recent_bookings' => BookingResource::collection($bookings->take(5)),
            ],
        ]);
    }
}
