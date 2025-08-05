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
        Schema::table('procedure_submissions', function (Blueprint $table) {
            $table->tinyInteger('status')->default(0); // 0: pending, 1: approved, 2: rejected
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('procedure_submissions', function (Blueprint $table) {
            //
        });
    }
};
