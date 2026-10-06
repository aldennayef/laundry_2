<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Public;

use App\Domain\Contracts\Repositories\AppSettingRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\AppSettingResource;
use Illuminate\Http\JsonResponse;

final class PublicSettingController extends Controller
{
    public function __construct(
        private readonly AppSettingRepositoryInterface $settings,
    ) {
    }

    public function show(): JsonResponse
    {
        $settings = $this->settings->current();

        return response()->json(['data' => $settings ? new AppSettingResource($settings) : null]);
    }
}
