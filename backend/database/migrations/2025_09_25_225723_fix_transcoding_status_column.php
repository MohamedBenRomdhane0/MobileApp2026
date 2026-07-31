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
        // First, let's check what the current column looks like and fix it
        Schema::table('media_metadata', function (Blueprint $table) {
            // Change transcoding_status to a larger VARCHAR to accommodate new status values
            $table->string('transcoding_status', 50)->change();
        });

        // If the above doesn't work, we might need to drop and recreate the column
        // Uncomment this if the change() method fails:
        /*
        // Get existing data
        $existingData = DB::table('media_metadata')->get(['id', 'transcoding_status']);
        
        // Drop the column
        Schema::table('media_metadata', function (Blueprint $table) {
            $table->dropColumn('transcoding_status');
        });
        
        // Recreate with proper size
        Schema::table('media_metadata', function (Blueprint $table) {
            $table->string('transcoding_status', 50)->nullable()->after('status');
        });
        
        // Restore data
        foreach ($existingData as $record) {
            DB::table('media_metadata')
                ->where('id', $record->id)
                ->update(['transcoding_status' => $record->transcoding_status]);
        }
        */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media_metadata', function (Blueprint $table) {
            // Revert to original size if needed
            $table->string('transcoding_status', 20)->change();
        });
    }
};