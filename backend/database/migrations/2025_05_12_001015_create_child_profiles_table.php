<?php

use App\Enum\ChildGenderEnum;
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
        Schema::create('child_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('gender', ChildGenderEnum::getValues())->comment('girl , boy');
            $table->foreignId('parent_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('level_id')->nullable()->constrained('levels')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('child_profiles');
    }
};
