<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_articles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('author_id')->nullable()->constrained('tbl_users')->nullOnDelete();
            $table->string('title', 200);
            $table->string('slug', 220)->unique();
            $table->text('content')->nullable();
            $table->string('thumbnail_path')->nullable();
            $table->timestampTz('published_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();

            $table->index(['is_active', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_articles');
    }
};
