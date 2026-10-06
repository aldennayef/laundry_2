<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Customer;

use App\Application\DTOs\RedeemVoucherDTO;
use App\Application\Services\LoyaltyService;
use App\Domain\Contracts\Repositories\VoucherRedemptionRepositoryInterface;
use App\Domain\Contracts\Repositories\VoucherRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\RedeemVoucherRequest;
use App\Http\Resources\VoucherRedemptionResource;
use App\Http\Resources\VoucherResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CustomerVoucherController extends Controller
{
    public function __construct(
        private readonly VoucherRepositoryInterface $vouchers,
        private readonly VoucherRedemptionRepositoryInterface $redemptions,
        private readonly LoyaltyService $loyalty,
    ) {
    }

    /**
     * Catalog of vouchers redeemable with points.
     */
    public function catalog(): JsonResponse
    {
        return response()->json([
            'data' => VoucherResource::collection($this->vouchers->activeRedeemable()),
        ]);
    }

    /**
     * Vouchers the customer has redeemed.
     */
    public function mine(Request $request): JsonResponse
    {
        $redemptions = $this->redemptions->byUser($request->user()->id);

        return response()->json(['data' => VoucherRedemptionResource::collection($redemptions)]);
    }

    public function redeem(RedeemVoucherRequest $request): JsonResponse
    {
        $dto = RedeemVoucherDTO::fromArray([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        $redemption = $this->loyalty->redeemVoucher($dto);

        return response()->json([
            'message' => 'Voucher berhasil ditukar.',
            'data' => new VoucherRedemptionResource($redemption),
        ], 201);
    }
}
