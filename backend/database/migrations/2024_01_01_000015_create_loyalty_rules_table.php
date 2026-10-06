<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_loyalty_rules', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('store_id')->nullable()->constrained('tbl_stores')->cascadeOnDelete();
            $table->string('rule_name', 100);
            $table->decimal('spend_per_point', 14, 2)->default(1000);
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_loyalty_rules');
    }
};
