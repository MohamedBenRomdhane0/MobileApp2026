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
        Schema::create('media_trackings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('media_id')->constrained('media')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('media_type', ['video', 'file'])->default('video');
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->integer('progress_percent')->default(0);
            $table->integer('watched_seconds')->default(0);
            $table->integer('last_position')->nullable();
            $table->integer('read_percent')->nullable();
            $table->integer('total_time_spent')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->unique(['media_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_trackings');
    }
};
