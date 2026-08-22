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
        Schema::create('labtest_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('labtest_id')->constrained('labtests');
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
        Schema::dropIfExists('labtest_prices');
    }
};
