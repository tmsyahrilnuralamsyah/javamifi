<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('author');
            $table->string('publisher')->nullable();
            $table->string('isbn')->nullable();
            $table->decimal('price_normal', 12, 2);
            $table->decimal('price_discount', 12, 2)->nullable();
            $table->string('cover')->nullable();
            $table->text('drive_link');
            $table->longText('description')->nullable();
            $table->boolean('is_published')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
