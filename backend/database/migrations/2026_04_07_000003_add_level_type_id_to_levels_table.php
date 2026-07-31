<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('levels', 'level_type_id')) {
            Schema::table('levels', function (Blueprint $table) {
                $table->foreignId('level_type_id')
                    ->nullable()
                    ->after('name')
                    ->constrained('level_types')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        Schema::table('levels', function (Blueprint $table) {
            $table->dropForeign(['level_type_id']);
            $table->dropColumn('level_type_id');
        });
    }
};
