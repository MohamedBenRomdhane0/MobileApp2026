<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
    	if (!Schema::hasColumn('books', 'creator_id')) {
        	Schema::table('books', function (Blueprint $table) {
            		$table->unsignedBigInteger('creator_id')->nullable()->after('user_id');
        	});
    	}
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropForeign(['creator_id']);
            $table->dropColumn('creator_id');
        });
    }
};
