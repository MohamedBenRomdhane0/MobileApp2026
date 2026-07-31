<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('section_materials')) {
            return;
        }

        Schema::create('section_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained()->cascadeOnDelete();
            $table->foreignId('material_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['section_id', 'material_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('section_materials');
    }
};
