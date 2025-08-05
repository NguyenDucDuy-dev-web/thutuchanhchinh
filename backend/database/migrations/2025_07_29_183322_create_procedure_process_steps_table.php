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
        Schema::create('procedure_process_steps', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('procedure_process_id');
            $table->integer('step_order');
            $table->string('name');
            $table->text('description');
            $table->timestamps();

            $table->foreign('procedure_process_id')->references('id')->on('procedure_processes')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procedure_process_steps');
    }
};
