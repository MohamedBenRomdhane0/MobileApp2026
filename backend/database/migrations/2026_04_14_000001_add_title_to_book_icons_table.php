<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('book_icons', function (Blueprint $table) {
            $table->string('title')->nullable()->after('size');
        });
    }

    public function down(): void
    {
        Schema::table('book_icons', function (Blueprint $table) {
            $table->dropColumn('title');
        });
    }
};
