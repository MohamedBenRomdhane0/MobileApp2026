<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('teacher_followers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('child_id')->constrained('users')->onDelete('cascade');

            $table->timestamp('followed_at')->useCurrent();

            $table->unique(['teacher_id', 'child_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_followers');
    }
};

