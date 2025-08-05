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
        Schema::create('procedure_submissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('procedure_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->tinyInteger('status')->default(0);
            $table->timestamps();
            $table->foreign('procedure_id')
                ->references('id')->on('procedures')
                ->onDelete('restrict');

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('set null');
            $table->index('procedure_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procedure_submissions');
    }
};
