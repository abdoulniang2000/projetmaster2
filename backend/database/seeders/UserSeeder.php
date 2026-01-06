<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('name', 'ADMIN')->first();
        $enseignantRole = Role::where('name', 'ENSEIGNANT')->first();
        $etudiantRole = Role::where('name', 'ETUDIANT')->first();

        // Admin User
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'status' => true,
        ]);
        $admin->roles()->attach($adminRole);

        // Enseignant Users
        $enseignant1 = User::create([
            'first_name' => 'Prof',
            'last_name' => 'Alpha',
            'username' => 'prof.alpha',
            'email' => 'prof.alpha@example.com',
            'password' => Hash::make('password'),
            'status' => true,
        ]);
        $enseignant1->roles()->attach($enseignantRole);

        $enseignant2 = User::create([
            'first_name' => 'Prof',
            'last_name' => 'Beta',
            'username' => 'prof.beta',
            'email' => 'prof.beta@example.com',
            'password' => Hash::make('password'),
            'status' => true,
        ]);
        $enseignant2->roles()->attach($enseignantRole);

        // Etudiant Users
        $etudiant1 = User::create([
            'first_name' => 'Etudiant',
            'last_name' => 'Un',
            'username' => 'etudiant.un',
            'email' => 'etudiant.un@example.com',
            'password' => Hash::make('password'),
            'status' => true,
        ]);
        $etudiant1->roles()->attach($etudiantRole);

        $etudiant2 = User::create([
            'first_name' => 'Etudiant',
            'last_name' => 'Deux',
            'username' => 'etudiant.deux',
            'email' => 'etudiant.deux@example.com',
            'password' => Hash::make('password'),
            'status' => true,
        ]);
        $etudiant2->roles()->attach($etudiantRole);

        $etudiant3 = User::create([
            'first_name' => 'Etudiant',
            'last_name' => 'Trois',
            'username' => 'etudiant.trois',
            'email' => 'etudiant.trois@example.com',
            'password' => Hash::make('password'),
            'status' => true,
        ]);
        $etudiant3->roles()->attach($etudiantRole);
    }
}
