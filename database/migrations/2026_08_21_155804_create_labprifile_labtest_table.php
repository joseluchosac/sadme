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
        Schema::create('labprifile_labtest', function (Blueprint $table) {
            $table->id();
            $table->foreignId('labprofile_id')->constrained('labprofiles')->onDelete('cascade');
            $table->foreignId('labtest_id')->constrained('labtests')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('labprifile_labtest');
    }
};
