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
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();
            $table->string('seccion', 3);
            $table->tinyInteger('ordinal');
            $table->string('campo');
            $table->string('campo_desc');
            $table->string('valor');
            $table->timestamps();
            // Índice único compuesto
            $table->unique(['seccion', 'ordinal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_settings');
    }
};
