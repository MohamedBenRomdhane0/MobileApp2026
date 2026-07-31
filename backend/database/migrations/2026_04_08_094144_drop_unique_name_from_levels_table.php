<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('levels', function (Blueprint $table) {
            $indexes = collect(\DB::select("SHOW INDEX FROM levels WHERE Key_name != 'PRIMARY'"))
                ->pluck('Key_name')->toArray();
            if (in_array('levels_name_unique', $indexes)) {
                $table->dropUnique(['name']);
            }
        });
    }

    public function down(): void
    {
        Schema::table('levels', function (Blueprint $table) {
            $table->unique('name');
        });
    }
};
