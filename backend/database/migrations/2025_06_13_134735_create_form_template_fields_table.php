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
        Schema::create('form_template_fields', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('form_template_id');  
            $table->unsignedBigInteger('field_id');          
            $table->integer('page');
            $table->double('position_x');
            $table->double('position_y');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_template_fields');
    }
};
