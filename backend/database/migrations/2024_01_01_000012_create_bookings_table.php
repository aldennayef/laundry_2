<?php

use App\Domain\Enums\BookingStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_bookings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('booking_code', 30)->unique();
            $table->foreignId('user_id')->constrained('tbl_users')->restrictOnDelete();
            $table->foreignId('store_id')->constrained('tbl_stores')->restrictOnDelete();
            $table->foreignId('service_id')->constrained('tbl_services')->restrictOnDelete();
            $table->foreignId('service_type_id')->nullable()->constrained('tbl_service_type')->nullOnDelete();
            $table->foreignId('voucher_id')->nullable()->constrained('tbl_vouchers')->nullOnDelete();
            $table->string('cust_name', 150);
            $table->string('cust_phone', 30);
            $table->text('cust_address')->nullable();
            $table->text('notes')->nullable();
            $table->date('booking_date');
            $table->timestampTz('pickup_schedule')->nullable();
            $table->timestampTz('delivery_schedule')->nullable();
            $table->decimal('estimated_amount', 14, 2)->default(0);
            $table->decimal('service_type_price', 14, 2)->default(0);
            $table->decimal('discount_amount', 14, 2)->default(0);
            $table->decimal('final_amount', 14, 2)->default(0);
            $table->string('status', 20)->default(BookingStatus::PENDING->value);
            $table->timestampsTz();

            $table->index(['user_id', 'status']);
            $table->index(['store_id', 'status']);
            $table->index('booking_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_bookings');
    }
};
