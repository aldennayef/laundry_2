<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Customer;

use App\Domain\Contracts\Repositories\AddressRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\AddressRequest;
use App\Http\Resources\AddressResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CustomerAddressController extends Controller
{
    public function __construct(
        private readonly AddressRepositoryInterface $addresses,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => AddressResource::collection($this->addresses->byUser($request->user()->id)),
        ]);
    }

    public function store(AddressRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        if (! empty($data['is_default'])) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = $this->addresses->create($data);

        return response()->json(['message' => 'Alamat ditambahkan.', 'data' => new AddressResource($address)], 201);
    }

    public function update(AddressRequest $request, int $id): JsonResponse
    {
        $address = $this->addresses->findByIdOrFail($id);

        abort_if($address->user_id !== $request->user()->id, 403, 'Akses ditolak.');

        $data = $request->validated();
        if (! empty($data['is_default'])) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = $this->addresses->update($address, $data);

        return response()->json(['message' => 'Alamat diperbarui.', 'data' => new AddressResource($address)]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $address = $this->addresses->findByIdOrFail($id);

        abort_if($address->user_id !== $request->user()->id, 403, 'Akses ditolak.');

        $this->addresses->delete($address);

        return response()->json(['message' => 'Alamat dihapus.']);
    }
}
