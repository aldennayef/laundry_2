<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_vouchers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('store_id')->nullable()->constrained('tbl_stores')->cascadeOnDelete();
            $table->foreignId('membership_tier_id')->nullable()->constrained('tbl_membership_tiers')->nullOnDelete();
            $table->foreignId('service_id')->nullable()->constrained('tbl_services')->nullOnDelete();
            $table->string('code', 50)->unique();
            $table->string('discount_type', 20)->default('fixed');
            $table->decimal('discount_value', 14, 2)->default(0);
            $table->decimal('min_order_amount', 14, 2)->default(0);
            $table->decimal('max_discount_amount', 14, 2)->nullable();
            $table->unsignedInteger('redeem_quota')->nullable();
            $table->unsignedInteger('quota_per_user')->nullable();
            $table->unsignedInteger('point_cost')->default(0);
            $table->timestampTz('start_time')->nullable();
            $table->timestampTz('end_time')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestampsTz();

            $table->index(['is_active', 'point_cost']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_vouchers');
    }
};
