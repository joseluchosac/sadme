<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/products.json');
        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        foreach ($data as $item) {
            Product::create($item);
        }
    }
}
