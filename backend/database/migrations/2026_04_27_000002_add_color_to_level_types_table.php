<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('level_types', 'color')) {
            Schema::table('level_types', function (Blueprint $table) {
                $table->string('color', 20)->default('#22BEC8')->after('name');
            });
        }
    }

    public function down(): void
    {
        Schema::table('level_types', function (Blueprint $table) {
            $table->dropColumn('color');
        });
    }
};
