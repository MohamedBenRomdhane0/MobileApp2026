<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('level_section_service_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_section_id')->constrained('level_sections')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
            $table->unique(['level_section_id', 'service_id'], 'lss_service_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_section_service_settings');
    }
};
