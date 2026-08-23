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
        Schema::create('affectation_types', function (Blueprint $table) {
            $table->id();
            $table->string('code', 3);
            $table->string('name', 50);
            $table->string('tax_letter', 50);
            $table->string('tax_code', 50);
            $table->string('tax_name', 50);
            $table->string('tax_type', 50);
            $table->decimal('tax_percentage', 10, 2)->default(0);
            $table->decimal('importe_icbper', 10, 2)->default(0);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affectation_types');
    }
};
