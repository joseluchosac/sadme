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
            UnitSeeder::class,
            AffectationTypeSeeder::class,
            CompanySettingSeeder::class,
            ProductTypeSeeder::class,
            ProductSeeder::class,
        ]);

        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
