<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products_labPath = database_path('seeders/data/products_lab.json');
        $jsonLab = file_get_contents($products_labPath);
        $dataLab = json_decode($jsonLab, true);

        foreach ($dataLab as $item) {
            $item['unit_code'] = 'ZZ';
            $item['affectation_type_id'] = 2;
            Product::create($item);
        }
    }
}
