<?php

namespace Database\Seeders;

use App\Models\Ubigeo;
use Illuminate\Database\Seeder;

class UbigeoSeeder extends Seeder
{

    public function run(): void
    {
        $jsonPath = database_path('seeders/data/ubigeos.json');
        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        foreach ($data as $item){
            Ubigeo::create($item);
        }
    }
}
