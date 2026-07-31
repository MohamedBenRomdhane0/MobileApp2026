<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promo_configs', function (Blueprint $table) {
            $table->id();
            $table->boolean('promo_system_enabled')->default(true);
            $table->boolean('require_admin_approval')->default(false);
            $table->boolean('allow_teachers_to_create')->default(true);
            $table->json('available_discount_kinds')->nullable();
            $table->decimal('max_discount_percent', 5, 2)->default(50);
            $table->decimal('max_discount_fixed', 8, 2)->default(100);
            $table->unsignedSmallInteger('max_free_sessions')->default(3);
            $table->decimal('min_discount_percent', 5, 2)->default(5);
            $table->decimal('min_discount_fixed', 8, 2)->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_configs');
    }
};
