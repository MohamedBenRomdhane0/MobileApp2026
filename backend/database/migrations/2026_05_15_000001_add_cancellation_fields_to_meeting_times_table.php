<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_times', function (Blueprint $table) {
            $table->enum('cancellation_reason', ['illness', 'force_majeure', 'personal'])
                  ->nullable()
                  ->after('status');
            $table->text('cancellation_comment')->nullable()->after('cancellation_reason');
        });
    }

    public function down(): void
    {
        Schema::table('meeting_times', function (Blueprint $table) {
            $table->dropColumn(['cancellation_reason', 'cancellation_comment']);
        });
    }
};
