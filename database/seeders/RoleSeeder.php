<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // users
            'create-users',
            'read-users',
            'update-users',
            'delete-users',
            // roles
            'create-roles',
            'read-roles',
            'update-roles',
            'delete-roles',
            // permissions
            'create-permissions',
            'read-permissions',
            'update-permissions',
            'delete-permissions',
            // company_settings
            'create-company_settings',
            'read-company_settings',
            'update-company_settings',
            'delete-company_settings',
        ];

        foreach($permissions as $permission){
            Permission::create(['name' => $permission]);
        }

        Role::create(['name' => 'admin'])->givePermissionTo(Permission::all());
    }
}
