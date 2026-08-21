<?php

namespace Database\Seeders;

use App\Models\LabTest;
use Illuminate\Database\Seeder;

class LabTestSeeder extends Seeder
{

    public function run(): void
    {
        $jsonPath = database_path('seeders/data/lab_tests.json');
        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        foreach ($data as $item){
            LabTest::create($item);
        }
    }
}
