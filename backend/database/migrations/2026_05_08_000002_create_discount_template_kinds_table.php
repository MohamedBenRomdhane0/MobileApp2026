<?php

use App\Enum\DiscountKindEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discount_template_kinds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('discount_template_id')
                  ->constrained('discount_templates')
                  ->cascadeOnDelete();
            $table->enum('kind', DiscountKindEnum::toArray());
            $table->boolean('is_default')->default(false);
            $table->decimal('min_value', 8, 2)->nullable();
            $table->decimal('max_value', 8, 2)->nullable();
            $table->decimal('default_value', 8, 2)->nullable();
            $table->timestamps();

            $table->unique(['discount_template_id', 'kind']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discount_template_kinds');
    }
};
