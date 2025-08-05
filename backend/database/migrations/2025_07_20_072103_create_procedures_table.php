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
        Schema::create('procedures', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('form_template_id');
            $table->unsignedBigInteger('process_id')->nullable();
            $table->string('title');
            $table->string('short_desc');
            $table->text('content');
            $table->string('room');
            $table->string('time');
            $table->string('image');
            $table->integer('type')->default(0);
            $table->integer('format')->default(0);
            $table->timestamps();


            $table->foreign('form_template_id')->references('id')->on('form_templates')->onDelete('restrict');
            $table->foreign('process_id')->references('id')->on('procedure_processes')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procedures');
    }
};
