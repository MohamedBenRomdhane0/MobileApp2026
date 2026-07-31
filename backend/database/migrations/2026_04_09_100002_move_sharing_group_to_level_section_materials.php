<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('level_section_materials', function (Blueprint $table) {
            $table->char('sharing_group', 1)->nullable()->after('material_id');
        });
    }

    public function down(): void
    {
        Schema::table('level_section_materials', function (Blueprint $table) {
            $table->dropColumn('sharing_group');
        });

    }
};
