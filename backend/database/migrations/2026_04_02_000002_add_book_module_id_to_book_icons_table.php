<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('book_icons', function (Blueprint $table) {
            $table->foreignId('book_module_id')
                ->nullable()
                ->after('book_id')
                ->constrained('book_modules')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('book_icons', function (Blueprint $table) {
            $table->dropForeign(['book_module_id']);
            $table->dropColumn('book_module_id');
        });
    }
};
