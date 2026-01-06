<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create(['name' => 'ADMIN', 'display_name' => 'Administrateur']);
        Role::create(['name' => 'ENSEIGNANT', 'display_name' => 'Enseignant']);
        Role::create(['name' => 'ETUDIANT', 'display_name' => 'Etudiant', 'is_default' => true]);
    }
}
