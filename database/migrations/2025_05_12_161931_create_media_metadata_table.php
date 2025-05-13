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
        Schema::create('media_metadata', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_id')->constrained('media')->onDelete('cascade');
            $table->integer('views')->default(0)->comment('Number of views');
            $table->integer('watch_time')->default(0)->comment('Total watch time in seconds');
            $table->unsignedBigInteger('transcoding_status')->default(0)->comment('0: PENDING, 1: PROCESSING, 2: TRANSCODED, 3: FAILED');
            $table->timestamp('last_seen_at')->nullable()->comment('Last time the media was seen');
            $table->unsignedBigInteger('status')->default(1)->comment('1: Active, 2: Inactive');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_metadata');
    }
};
