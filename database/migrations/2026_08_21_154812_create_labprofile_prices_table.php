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
        Schema::create('labprofile_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('labprofile_id')->constrained('labprofiles')->onDelete('cascade');
            $table->decimal('price', 10, 2)->default(0);
            $table->string('concept', 50);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('labprofile_prices');
    }
};
