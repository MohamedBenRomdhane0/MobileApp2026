<?php

use App\Enum\PricingTypeEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plan_pricings', function (Blueprint $table) {
            $table->string('pricing_type')->default(PricingTypeEnum::TOTAL->value)->after('is_highlighted');
        });
    }

    public function down(): void
    {
        Schema::table('plan_pricings', function (Blueprint $table) {
            $table->dropColumn('pricing_type');
        });
    }
};
