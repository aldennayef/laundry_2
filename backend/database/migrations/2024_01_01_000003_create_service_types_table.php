<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_service_type', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('service_type_name', 100);
            $table->unsignedInteger('processing_time')->default(1);
            $table->string('processing_time_unit', 20)->default('hari');
            $table->decimal('price', 14, 2)->default(0);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_service_type');
    }
};
