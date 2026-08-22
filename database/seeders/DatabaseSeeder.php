<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UbigeoSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            CompanySettingSeeder::class,
            LabtestSeeder::class,
            LabprofileSeeder::class,
        ]);
        
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
