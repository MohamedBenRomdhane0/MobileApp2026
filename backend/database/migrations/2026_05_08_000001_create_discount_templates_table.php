<?php

use App\Enum\DiscountBehaviorEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discount_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('description', 255)->nullable();
            $table->string('icon', 30)->default('tag');
            $table->string('color', 20)->default('teal');
            $table->enum('behavior', DiscountBehaviorEnum::toArray())
                  ->default(DiscountBehaviorEnum::SINGLE_NUMBER->value);
            $table->json('behavior_config')->nullable();
            $table->boolean('enabled')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discount_templates');
    }
};
