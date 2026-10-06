<?php

use App\Domain\Enums\MapsProvider;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_app_settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 150);
            $table->string('title', 150)->nullable();
            $table->string('logo_path')->nullable();
            $table->string('favicon_path')->nullable();
            $table->text('address')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('signature_path')->nullable();
            $table->string('currency', 10)->default('IDR');
            $table->string('service_fee_type', 20)->default('fixed');
            $table->decimal('service_fee_value', 14, 2)->default(0);
            $table->string('tax_type', 20)->default('percent');
            $table->decimal('tax_value', 5, 2)->default(0);
            $table->boolean('include_service_fee')->default(false);
            $table->string('maps_provider', 30)->default(MapsProvider::GOOGLE->value);
            $table->string('maps_api_key')->nullable();
            $table->decimal('maps_default_lat', 10, 7)->nullable();
            $table->decimal('maps_default_lng', 10, 7)->nullable();
            $table->integer('maps_zoom')->default(13);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_app_settings');
    }
};
