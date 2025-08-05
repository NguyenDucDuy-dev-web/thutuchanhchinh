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
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable()->change(); 
            $table->tinyInteger('role')->default(2)->comment('0: Admin, 1: Giảng viên, 2: Sinh viên')->change();
            $table->boolean('is_change_password')->default(true)->comment('true: Bắt buộc đổi password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
