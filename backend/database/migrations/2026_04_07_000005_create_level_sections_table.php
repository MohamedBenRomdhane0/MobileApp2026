<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('level_sections')) return;
        Schema::create('level_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_id')->constrained('levels')->cascadeOnDelete();
            $table->foreignId('section_id')->constrained('sections')->cascadeOnDelete();
            $table->unique(['level_id', 'section_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_sections');
    }
};
