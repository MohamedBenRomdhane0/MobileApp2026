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
        Schema::create('video_watch_stats', function (Blueprint $table) {
            $table->id();
            $table->string('video_id')->unique();
            $table->unsignedBigInteger('total_seconds_all_users')->default(0);
            $table->unsignedInteger('unique_viewers')->default(0);
            $table->decimal('avg_completion_pct', 5, 2)->default(0);
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_watch_stats');
    }
};
