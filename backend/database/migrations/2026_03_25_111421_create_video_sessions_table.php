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
        Schema::create('video_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('video_id');
            $table->json('watch_segments')->nullable();
            $table->unsignedInteger('total_seconds')->default(0);
            $table->float('last_position_sec', 10, 3)->default(0);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
 
            $table->unique(['user_id', 'video_id']);
            $table->index('user_id');
            $table->index('video_id');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_sessions');
    }
};
