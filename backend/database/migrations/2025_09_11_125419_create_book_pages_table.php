<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('book_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('page_number');
            $table->string('disk', 32)->default('s3'); // disk where the page image is store
            $table->string('path_thumb')->nullable(); // path to the thumbnail image of the page
            $table->string('path_md');
            $table->string('path_lg')->nullable();
            $table->unsignedInteger('width')->nullable(); // px
            $table->unsignedInteger('height')->nullable(); // px
            $table->string('mime_type', 64)->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->string('checksum', 64)->nullable();

            $table->json('meta')->nullable();

            $table->timestamps();
            $table->softDeletes();
             $table->unique(['book_id', 'page_number']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_pages');
    }
};
