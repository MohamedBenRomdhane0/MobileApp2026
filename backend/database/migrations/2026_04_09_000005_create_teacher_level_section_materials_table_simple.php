<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teacher_level_section_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('level_section_material_id');
            
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('level_section_material_id', 'tls_lsm_fk')->references('id')->on('level_section_materials')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_level_section_materials');
    }
};
