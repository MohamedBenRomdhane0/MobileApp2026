<?php

use App\Enum\QuizStatusEnum;
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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->morphs('model');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('level_material_id')->nullable()->constrained('level_materials')->onDelete('cascade');
            $table->enum('status', QuizStatusEnum::getValues())->nullable();
            $table->string('title')->nullable();
            $table->float('score')->nullable();
            $table->boolean('is_exam')->default(false);
            $table->integer('duration')->nullable()->comment('in seconds');
            $table->integer('attempts')->nullable();
            $table->integer('pass_mark')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
        

    }
};
