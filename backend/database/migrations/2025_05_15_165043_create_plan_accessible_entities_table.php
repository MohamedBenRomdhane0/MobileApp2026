<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_accessible_entities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained('plans')->onDelete('cascade');
            $table->string('accessible_type');
            $table->unsignedBigInteger('accessible_id');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['accessible_type', 'accessible_id']);
            $table->unique(['plan_id', 'accessible_type', 'accessible_id'], 'plan_accessible_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_accessible_entities');
    }
};
