<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('level_type_periods')) return;
        Schema::create('level_type_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_type_id')
                ->constrained('level_types')
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('from');
            $table->string('to');
            $table->unsignedTinyInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_type_periods');
    }
};
