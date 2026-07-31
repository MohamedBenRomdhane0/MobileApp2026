<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('level_type_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_type_id')->constrained('level_types')->cascadeOnDelete();
            $table->foreignId('section_id')->constrained('sections')->cascadeOnDelete();
            $table->unique(['level_type_id', 'section_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_type_sections');
    }
};
