<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE draft_users MODIFY expires_at DATETIME NOT NULL');
        DB::statement('UPDATE draft_users SET expires_at = DATE_ADD(created_at, INTERVAL 30 DAY) WHERE deleted_at IS NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE draft_users MODIFY expires_at TIMESTAMP NOT NULL');
    }
};
