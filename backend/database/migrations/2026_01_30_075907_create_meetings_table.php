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
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->foreignId('level_id')->constrained('levels')->onDelete('cascade');
            $table->foreignId('material_id')->constrained('materials')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_private')->default(0);
            $table->integer('max_students')->nullable();
            $table->boolean('has_free_trial')->default(1);
            $table->integer('total_sessions');
            $table->decimal('price', 8, 2)->default(0);
            $table->decimal('discount', 8, 2)->default(0);
            $table->string('status')->default('draft');
            $table->string('timezone')->default('Africa/Tunis');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
