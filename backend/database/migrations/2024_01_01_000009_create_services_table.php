<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_services', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('service_category_id')->constrained('tbl_service_categories')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained('tbl_stores')->cascadeOnDelete();
            $table->foreignId('service_unit_id')->nullable()->constrained('tbl_service_unit')->nullOnDelete();
            $table->string('service_name', 150);
            $table->decimal('price', 14, 2)->default(0);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();

            $table->index(['store_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_services');
    }
};
