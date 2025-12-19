<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Appeler les seeders dans l'ordre
        $this->call([
            // D'abord les rôles et permissions
            RoleAndPermissionSeeder::class,
            
            // Ensuite les utilisateurs de test
            // User::factory(10)->create(),
            
            // Enfin, créer l'utilisateur admin
            AdminUserSeeder::class,
        ]);
    }
}
