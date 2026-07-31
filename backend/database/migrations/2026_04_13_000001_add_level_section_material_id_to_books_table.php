<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->foreignId('level_section_material_id')
                ->nullable()
                ->after('level_material_id')
                ->constrained('level_section_materials')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropForeign(['level_section_material_id']);
            $table->dropColumn('level_section_material_id');
        });
    }
};
