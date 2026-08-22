<?php

namespace Database\Seeders;

use App\Models\Labprofile;
use Illuminate\Database\Seeder;

class LabprofileSeeder extends Seeder
{

    public function run(): void
    {
        $jsonPath = database_path('seeders/data/labprofiles.json');
        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        foreach ($data as $item){
            Labprofile::create($item);
        }
    }
}
