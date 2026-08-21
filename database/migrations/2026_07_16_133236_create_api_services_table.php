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
        Schema::create('api_services', function (Blueprint $table) {
            $table->id();
            $table->string('service', 50);
            $table->string('provider', 100);
            $table->string('url', 100);
            $table->string('method', 10);
            $table->text('token')->nullable();
            $table->string('token_type', 20)->nullable();
            $table->tinyInteger('default')->default(0);
            $table->text('details')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->timestamps();

            // Índice único compuesto
            $table->unique(['service', 'provider']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_services');
    }
};
