<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teacher_level_materials', function (Blueprint $table) {
            $table->dropColumn('is_concours');
        });
    }

    public function down(): void
    {
        Schema::table('teacher_level_materials', function (Blueprint $table) {
            $table->boolean('is_concours')->default(false)->comment('1: Concours, 0: Non Concours');
        });
    }
};
