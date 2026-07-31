<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            $table->foreignId('level_section_id')
                ->nullable()
                ->after('level_id')
                ->constrained('level_sections')
                ->nullOnDelete();

            // Remove the flat price/discount — pricing lives on groups now
            $table->dropColumn(['price', 'discount', 'max_students']);
        });
    }

    public function down(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->dropForeign(['level_section_id']);
            $table->dropColumn(['description', 'level_section_id']);
            $table->decimal('price', 8, 2)->default(0);
            $table->decimal('discount', 8, 2)->default(0);
            $table->integer('max_students')->nullable();
        });
    }
};
