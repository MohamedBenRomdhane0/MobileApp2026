<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_groups', function (Blueprint $table) {
            // Capacity
            $table->unsignedSmallInteger('max_students')->default(1)->after('name');

            // Pricing — unit_price is what the student pays, net_price is what the teacher earns
            $table->decimal('unit_price', 8, 2)->default(0)->after('max_students');
            $table->decimal('net_price', 8, 2)->default(0)->after('unit_price');

            // Period
            $table->date('start_date')->nullable()->after('net_price');
            $table->date('end_date')->nullable()->after('start_date');

            // Preset label (e.g. "ANNEE_SCOLAIRE", "CONCOURS", custom key)
            $table->string('preset')->nullable()->after('end_date');

            // Recurrence — how many times per week and per day this group meets
            $table->unsignedTinyInteger('sessions_per_week')->default(1)->after('preset');
            $table->unsignedTinyInteger('sessions_per_day')->default(1)->after('sessions_per_week');
        });
    }

    public function down(): void
    {
        Schema::table('meeting_groups', function (Blueprint $table) {
            $table->dropColumn([
                'max_students',
                'unit_price',
                'net_price',
                'start_date',
                'end_date',
                'preset',
                'sessions_per_week',
                'sessions_per_day',
            ]);
        });
    }
};
