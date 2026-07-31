<?php

use App\Enum\StatusEnum;
use App\Enum\TranscodeStatusEnum;
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
        Schema::create('media_metadata', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_id')->constrained('media')->onDelete('cascade');
            $table->integer('views')->default(0)->comment('Number of views');
            $table->integer('watch_time')->default(0)->comment('Total watch time in seconds');
            $table->enum('transcoding_status', TranscodeStatusEnum::getValues())->default(TranscodeStatusEnum::PENDING->value);
            $table->timestamp('last_seen_at')->nullable()->comment('Last time the media was seen');
            $table->enum('status', StatusEnum::getValues())->default(StatusEnum::INACTIVE->value);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_metadata');
    }
};
