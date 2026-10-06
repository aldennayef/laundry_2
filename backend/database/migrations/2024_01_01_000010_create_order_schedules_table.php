<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_order_schedules', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('store_id')->constrained('tbl_stores')->cascadeOnDelete();
            $table->string('day', 10);
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('type', 20)->default('pickup');
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();

            $table->index(['store_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_order_schedules');
    }
};
