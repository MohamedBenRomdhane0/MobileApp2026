<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('level_section_materials')) return;
        Schema::create('level_section_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_section_id')->constrained('level_sections')->cascadeOnDelete();
            $table->foreignId('material_id')->constrained('materials')->cascadeOnDelete();
            $table->unique(['level_section_id', 'material_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_section_materials');
    }
};
