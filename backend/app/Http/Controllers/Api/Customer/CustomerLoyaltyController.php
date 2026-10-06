<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Customer;

use App\Application\Services\LoyaltyService;
use App\Domain\Contracts\Repositories\LoyaltyRuleRepositoryInterface;
use App\Domain\Contracts\Repositories\PointTransactionRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\PointTransactionResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CustomerLoyaltyController extends Controller
{
    public function __construct(
        private readonly LoyaltyService $loyalty,
        private readonly PointTransactionRepositoryInterface $transactions,
        private readonly LoyaltyRuleRepositoryInterface $rules,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $rule = $this->rules->resolveForStore($user->store_id);

        return response()->json([
            'data' => [
                'balance' => $this->loyalty->currentBalance($user->id),
                'spend_per_point' => $rule ? (float) $rule->spend_per_point : null,
                'transactions' => PointTransactionResource::collection(
                    $this->transactions->byUser($user->id),
                ),
            ],
        ]);
    }
}
