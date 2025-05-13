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
        Schema::create('user_answer_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_answer_id')->constrained('user_answers')->onDelete('cascade');
            $table->float('score')->nullable();
            $table->enum('status', ['PASSED', 'FAILED', 'NEEDS_REVIEW']);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_answer_results');
    }
};
