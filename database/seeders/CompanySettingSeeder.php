<?php

namespace Database\Seeders;

use App\Models\CompanySetting;
use Illuminate\Database\Seeder;

class CompanySettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/company_settings.json');
        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);
        foreach ($data as $item) {
            CompanySetting::create($item);
        }
    }
}
