<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('level_section_material_service_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('level_section_material_id');
            $table->foreign('level_section_material_id', 'lsms_lsm_fk')
                  ->references('id')->on('level_section_materials')->cascadeOnDelete();
            $table->unsignedBigInteger('service_id');
            $table->foreign('service_id', 'lsms_service_fk')
                  ->references('id')->on('services')->cascadeOnDelete();
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
            $table->unique(['level_section_material_id', 'service_id'], 'lsm_service_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_section_material_service_settings');
    }
};
