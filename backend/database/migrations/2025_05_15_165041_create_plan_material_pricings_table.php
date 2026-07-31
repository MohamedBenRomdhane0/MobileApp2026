<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_material_pricings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('plan_pricing_id');
            $table->unsignedBigInteger('material_id');
            $table->decimal('price', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('plan_pricing_id')->references('id')->on('plan_pricings')->onDelete('cascade');
            $table->foreign('material_id')->references('id')->on('materials')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_material_pricings');
    }
};
