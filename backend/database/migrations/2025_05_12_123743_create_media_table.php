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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->morphs('model');
            $table->string('file_name')->nullable();
            $table->string('mime_type')->nullable();
            $table->string('file_path')->nullable();
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->unsignedBigInteger('size')->nullable()->comment('in bytes');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
