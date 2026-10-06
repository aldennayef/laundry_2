<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_voucher_redemptions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('user_id')->constrained('tbl_users')->cascadeOnDelete();
            $table->foreignId('voucher_id')->constrained('tbl_vouchers')->cascadeOnDelete();
            $table->unsignedInteger('points_used')->default(0);
            $table->timestampTz('redeemed_at')->useCurrent();
            $table->timestampTz('used_at')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestampsTz();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_voucher_redemptions');
    }
};
