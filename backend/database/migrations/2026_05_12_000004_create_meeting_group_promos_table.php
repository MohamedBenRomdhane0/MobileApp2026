<?php

use App\Enum\DiscountKindEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_group_promos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('meeting_group_id')
                ->constrained('meeting_groups')
                ->cascadeOnDelete();

            $table->foreignId('discount_template_id')
                ->constrained('discount_templates')
                ->cascadeOnDelete();

            // The chosen discount kind (percent / fixed / free)
            $table->enum('kind', DiscountKindEnum::toArray());

            // The actual discount value (e.g. 20 for 20%, 5 for 5 DT, 3 for 3 free sessions)
            $table->decimal('discount_value', 8, 2)->default(0);

            // Condition fields — which columns are used depends on discount_template.behavior:
            //   numeric_with_unit  → condition_value + condition_unit  (e.g. 50 students)
            //   single_number      → condition_value only              (e.g. 10)
            //   date_range         → condition_start_date + condition_end_date
            //   none               → no condition columns needed
            $table->decimal('condition_value', 10, 2)->nullable();
            $table->string('condition_unit')->nullable();
            $table->date('condition_start_date')->nullable();
            $table->date('condition_end_date')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_group_promos');
    }
};
