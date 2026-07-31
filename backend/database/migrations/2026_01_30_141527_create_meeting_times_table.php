<?php

use App\Enum\MeetingTimeStatusEnum;
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
        Schema::create('meeting_times', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('meeting_groups')->onDelete('cascade');
            $table->date('meeting_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->enum('status', MeetingTimeStatusEnum::getValues())
                ->default(MeetingTimeStatusEnum::ACTIVE->value);
            $table->json('reschedule_details')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_times');
    }
};
