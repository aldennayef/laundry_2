<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_membership_tiers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('tier_name', 50);
            $table->decimal('min_spend', 14, 2)->default(0);
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->decimal('bonus_point_multiplier', 5, 2)->default(1);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_membership_tiers');
    }
};
