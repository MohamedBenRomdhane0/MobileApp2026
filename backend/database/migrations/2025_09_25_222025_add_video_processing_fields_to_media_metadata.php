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
        Schema::table('media_metadata', function (Blueprint $table) {
            // Progress tracking for real-time updates
            $table->float('progress')->default(0)->after('transcoding_status');
            $table->text('error_message')->nullable()->after('progress');
            
            // Store original upload info for retry functionality
            $table->integer('total_chunks')->nullable()->after('error_message');
            $table->string('original_filename')->nullable()->after('total_chunks');
            
            // Processing timestamps for analytics
            $table->timestamp('processing_started_at')->nullable()->after('original_filename');
            $table->timestamp('processing_completed_at')->nullable()->after('processing_started_at');
            
            // Video metadata
            $table->decimal('duration', 10, 2)->nullable()->after('processing_completed_at');
            
            // Add indexes for better query performance
            $table->index(['transcoding_status', 'updated_at'], 'idx_status_updated');
            $table->index('progress', 'idx_progress');
        });

        // Add file_size column to media table if it doesn't exist
        if (Schema::hasTable('media')) {
            Schema::table('media', function (Blueprint $table) {
                if (!Schema::hasColumn('media', 'file_size')) {
                    $table->bigInteger('file_size')->nullable()->after('file_path');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media_metadata', function (Blueprint $table) {
            $table->dropIndex('idx_status_updated');
            $table->dropIndex('idx_progress');
            
            $table->dropColumn([
                'progress',
                'error_message',
                'total_chunks',
                'original_filename',
                'processing_started_at',
                'processing_completed_at',
                'duration'
            ]);
        });

        if (Schema::hasTable('media')) {
            Schema::table('media', function (Blueprint $table) {
                if (Schema::hasColumn('media', 'file_size')) {
                    $table->dropColumn('file_size');
                }
            });
        }
    }
};