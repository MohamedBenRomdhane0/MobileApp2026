<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('draft_users', function (Blueprint $table) {
            $table->id();
            $table->string('token', 80)->unique()->index();
            $table->unsignedBigInteger('level_id');
            $table->foreign('level_id')->references('id')->on('levels')->onDelete('cascade');
            $table->json('interactions')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('expires_at')->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('draft_users');
    }
};
