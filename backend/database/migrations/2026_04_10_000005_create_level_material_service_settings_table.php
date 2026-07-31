<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // For levels that have NO sections — materials are linked directly via level_materials
        Schema::create('level_material_service_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_material_id')->constrained('level_materials')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
            $table->unique(['level_material_id', 'service_id'], 'lms_service_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_material_service_settings');
    }
};
