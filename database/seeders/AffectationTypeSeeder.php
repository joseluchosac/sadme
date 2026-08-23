<?php

namespace Database\Seeders;

use App\Models\AffectationType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AffectationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $affectationTypes = [
            [
                'code' => '10',
                'name' => 'Gravado',
                'tax_letter' => 'S',
                'tax_code' => '1000',
                'tax_name' => 'IGV',
                'tax_type' => 'VAT',
                'tax_percentage' => 18,
                'importe_icbper' => 0,
            ],
            [
                'code' => '20',
                'name' => 'Exonerado',
                'tax_letter' => 'E',
                'tax_code' => '9997',
                'tax_name' => 'EXO',
                'tax_type' => 'VAT',
                'tax_percentage' => 0,
                'importe_icbper' => 0,
            ],
            [
                'code' => '30',
                'name' => 'Inafecto',
                'tax_letter' => 'O',
                'tax_code' => '9998',
                'tax_name' => 'INA',
                'tax_type' => 'FRE',
                'tax_percentage' => 0,
                'importe_icbper' => 0,
            ],
            [
                'code' => '10',
                'name' => 'Gravado',
                'tax_letter' => 'S',
                'tax_code' => '1000',
                'tax_name' => 'IGV',
                'tax_type' => 'VAT',
                'tax_percentage' => 10,
                'importe_icbper' => 0,
            ],
            [
                'code' => '10',
                'name' => 'ICBPER-Gravado',
                'tax_letter' => 'S',
                'tax_code' => '1000',
                'tax_name' => 'IGV',
                'tax_type' => 'VAT',
                'tax_percentage' => 18,
                'importe_icbper' => 0.5,
            ],
        ];

        foreach ($affectationTypes as $affectationType) {
            AffectationType::create($affectationType);
        }
    }
}
