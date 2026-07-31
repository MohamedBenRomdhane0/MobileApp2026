<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('materials', 'color')) {
            Schema::table('materials', function (Blueprint $table) {
                $table->string('color', 20)->default('#00BFA5')->after('name');
            });
        }
    }

    public function down(): void
    {
        Schema::table('materials', function (Blueprint $table) {
            $table->dropColumn('color');
        });
    }
};
