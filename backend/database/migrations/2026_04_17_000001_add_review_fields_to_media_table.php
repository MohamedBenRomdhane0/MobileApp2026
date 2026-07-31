<?php

use App\Enum\MediaReviewStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->string('review_status')
                  ->default(MediaReviewStatusEnum::PENDING->value)
                  ->after('is_active');

            $table->text('review_feedback')->nullable()->after('review_status');

            $table->timestamp('reviewed_at')->nullable()->after('review_feedback');

            $table->foreignId('reviewed_by')
                  ->nullable()
                  ->after('reviewed_at')
                  ->constrained('users')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['review_status', 'review_feedback', 'reviewed_at', 'reviewed_by']);
        });
    }
};
