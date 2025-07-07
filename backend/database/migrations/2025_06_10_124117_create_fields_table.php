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
        Schema::create('fields', function (Blueprint $table) {
            $table->id();
            $table->string('label');          
            $table->string('name')->index(); 
            $table->string('type');          
            $table->string('icon')->nullable();
            $table->enum('input_type', ['manual', 'db'])->default('manual'); 
            $table->string('source_table')->nullable();    
            $table->string('source_column')->nullable();   
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fields');
    }
};
