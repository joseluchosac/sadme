<?php

namespace Database\Seeders;

use App\Models\ProductType;
use Illuminate\Database\Seeder;

class ProductTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/product_types.json');
        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        foreach ($data as $item) {
            ProductType::create($item);
        }
    }
}
