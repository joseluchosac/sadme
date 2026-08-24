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
        Schema::create('p_labtests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('products')->onDelete('cascade');
            $table->mediumText('description')->nullable();
            $table->text('sirve')->nullable();
            $table->string('resultado');
            $table->string('muestra');
            $table->string('area');
            $table->text('exams')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_labtests');
    }
};
