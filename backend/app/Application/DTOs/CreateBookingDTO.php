<?php

declare(strict_types=1);

namespace App\Application\DTOs;

final class CreateBookingDTO extends DataTransferObject
{
    public function __construct(
        public readonly int $userId,
        public readonly int $storeId,
        public readonly int $serviceId,
        public readonly ?int $serviceTypeId,
        public readonly ?int $voucherId,
        public readonly ?int $voucherRedemptionId,
        public readonly string $custName,
        public readonly string $custPhone,
        public readonly ?string $custAddress,
        public readonly ?string $notes,
        public readonly string $bookingDate,
        public readonly ?string $pickupSchedule,
        public readonly ?string $deliverySchedule,
    ) {
    }

    public static function fromArray(array $data): static
    {
        return new self(
            userId: (int) $data['user_id'],
            storeId: (int) $data['store_id'],
            serviceId: (int) $data['service_id'],
            serviceTypeId: isset($data['service_type_id']) ? (int) $data['service_type_id'] : null,
            voucherId: isset($data['voucher_id']) ? (int) $data['voucher_id'] : null,
            voucherRedemptionId: isset($data['voucher_redemption_id']) ? (int) $data['voucher_redemption_id'] : null,
            custName: $data['cust_name'],
            custPhone: $data['cust_phone'],
            custAddress: $data['cust_address'] ?? null,
            notes: $data['notes'] ?? null,
            bookingDate: $data['booking_date'],
            pickupSchedule: $data['pickup_schedule'] ?? null,
            deliverySchedule: $data['delivery_schedule'] ?? null,
        );
    }
}
