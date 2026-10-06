<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('role_id')->constrained('tbl_roles')->restrictOnDelete();
            $table->foreignId('store_id')->nullable()->constrained('tbl_stores')->nullOnDelete();
            $table->foreignId('membership_tier_id')->nullable()->constrained('tbl_membership_tiers')->nullOnDelete();
            $table->string('username', 50)->nullable()->unique();
            $table->string('email', 150)->unique();
            $table->string('phone', 30)->nullable();
            $table->string('password');
            $table->decimal('balance', 14, 2)->default(0);
            $table->decimal('total_spend', 14, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestampsTz();

            $table->index(['role_id', 'is_active']);
            $table->index('store_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_users');
    }
};
