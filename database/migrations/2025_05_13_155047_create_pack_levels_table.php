<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pack_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pack_id')->constrained('packs')->onDelete('cascade');
            $table->foreignId('level_id')->constrained('levels')->onDelete('cascade');
            $table->decimal('price', 8, 2)->nullable();
            $table->integer('access_month')->nullable()->comment('in months'); // price per month
            $table->unsignedBigInteger('status')->nullable()->comment('1: Active, 2: Inactive');
            $table->decimal('discount', 8, 2)->nullable();

            $table->timestamp('start_date')->nullable(); 
            $table->timestamp('end_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pack_levels');
    }
};
