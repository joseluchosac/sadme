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
        Schema::create('ubigeos', function (Blueprint $table) {
            $table->id();
            $table->string('code_inei', 6)->unique();
            $table->string('code_reniec', 6)->unique();
            $table->string('departamento', 100)->index();
            $table->string('provincia', 100)->index()->nullable();
            $table->string('distrito', 100)->index()->nullable();
            $table->boolean('status')->default(true);
            $table->tinyInteger('sort')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ubigeos');
    }
};
