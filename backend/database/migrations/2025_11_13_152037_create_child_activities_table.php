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
        Schema::create('child_activities', function (Blueprint $t) {
            $t->bigIncrements('id');
            $t->unsignedBigInteger('child_id')->index();

            
            $t->enum('action_type', ['navigation','book','course','meeting','video']);

            $t->string('screen_name')->nullable();
            $t->unsignedBigInteger('reference_id')->nullable()->index();
            $t->unsignedInteger('duration')->nullable(); 
            $t->timestamp('created_at')->useCurrent();

            $t->index(['child_id','created_at']);
            $t->index(['action_type','created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('child_activities');
    }
};
