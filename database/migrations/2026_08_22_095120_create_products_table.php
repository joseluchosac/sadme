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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code', 12)->unique();
            $table->string('name')->unique();
            $table->string('unit_code', 3);
            $table->decimal('price', 10, 2)->default(0);
            $table->integer('min_stock')->default(0);
            $table->string('brand', 20)->nullable();
            $table->string('barcode', 20)->unique()->nullable();
            $table->foreignId('product_type_id')->default(1)
                ->constrained('product_types')->onDelete('restrict');
            $table->integer('affectation_type_id')->default(1);
            $table->text('description')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
