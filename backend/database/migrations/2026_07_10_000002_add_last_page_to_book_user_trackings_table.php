<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('book_user_trackings', function (Blueprint $table) {
            $table->unsignedInteger('last_page')->nullable()->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('book_user_trackings', function (Blueprint $table) {
            $table->dropColumn('last_page');
        });
    }
};
