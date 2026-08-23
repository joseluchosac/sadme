<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ruta del archivo JSON
        $jsonPath = database_path('seeders/data/units.json');

        // Leer y decodificar
        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        foreach ($data as $item) {
            Unit::create($item);
        }
    }
}
