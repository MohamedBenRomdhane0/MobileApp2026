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
        Schema::create('user_trial_status', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->unique();
            $table->unsignedInteger('total_watched_seconds')->default(0);
            $table->boolean('trial_exhausted')->default(false);
            $table->timestamp('exhausted_at')->nullable();
            $table->boolean('is_subscribed')->default(false);
            $table->timestamp('subscribed_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'trial_exhausted']);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_trial_status');
    }
};
