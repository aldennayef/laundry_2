<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_point_transactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('user_id')->constrained('tbl_users')->cascadeOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained('tbl_bookings')->nullOnDelete();
            $table->string('type', 10);
            $table->integer('points');
            $table->integer('balance_after')->default(0);
            $table->text('note')->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_point_transactions');
    }
};
