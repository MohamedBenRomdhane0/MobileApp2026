<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('meeting_groups', function (Blueprint $table) {
            $table->dropColumn('sessions_per_week');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meeting_groups', function (Blueprint $table) {
            $table->integer('sessions_per_week')->default(1)->after('name');
        });
    }
};
