<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Ruta del archivo JSON
        $jsonPath = database_path('seeders/data/categories.json');

        // Leer y decodificar
        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        foreach ($data as $item) {
            Category::create($item);
        }
    }
}
