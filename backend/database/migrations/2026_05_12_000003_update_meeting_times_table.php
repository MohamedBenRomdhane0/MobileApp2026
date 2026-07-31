<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_times', function (Blueprint $table) {
            // Duration in minutes (derived from start/end but stored for quick access)
            $table->unsignedSmallInteger('duration')->nullable()->after('end_time');

            // Which day of the week this slot falls on (0=Sun … 6=Sat) — for recurrence reference
            $table->unsignedTinyInteger('day_of_week')->nullable()->after('duration');

            // Occurrence index within the day: 1st session, 2nd session, etc.
            $table->unsignedTinyInteger('occurrence_in_day')->default(1)->after('day_of_week');
        });
    }

    public function down(): void
    {
        Schema::table('meeting_times', function (Blueprint $table) {
            $table->dropColumn(['duration', 'day_of_week', 'occurrence_in_day']);
        });
    }
};
