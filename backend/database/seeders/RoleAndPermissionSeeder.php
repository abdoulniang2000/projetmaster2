<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Désactiver les contraintes de clé étrangère
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Vider les tables
        DB::table('role_permissions')->truncate();
        DB::table('user_roles')->truncate();
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();
        
        // Réactiver les contraintes de clé étrangère
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Créer les rôles
        $adminRole = Role::create([
            'name' => 'admin',
            'display_name' => 'Administrateur',
            'description' => 'Accès complet au système',
            'is_default' => false,
        ]);

        $teacherRole = Role::create([
            'name' => 'enseignant',
            'display_name' => 'Enseignant',
            'description' => 'Accès aux fonctionnalités enseignants',
            'is_default' => false,
        ]);

        $studentRole = Role::create([
            'name' => 'etudiant',
            'display_name' => 'Étudiant',
            'description' => 'Accès aux fonctionnalités étudiants',
            'is_default' => true, // Rôle par défaut pour les nouveaux utilisateurs
        ]);

        // Créer les groupes de permissions
        $permissionGroups = [
            'Utilisateurs',
            'Rôles',
            'Permissions',
            'Cours',
            'Devoirs',
            'Soumissions',
            'Notes',
            'Annonces',
            'Messages',
            'Paramètres',
        ];

        // Permissions de base pour chaque groupe
        $permissions = [
            // Utilisateurs
            ['name' => 'view_users', 'display_name' => 'Voir les utilisateurs', 'group' => 'Utilisateurs'],
            ['name' => 'create_users', 'display_name' => 'Créer des utilisateurs', 'group' => 'Utilisateurs'],
            ['name' => 'edit_users', 'display_name' => 'Modifier les utilisateurs', 'group' => 'Utilisateurs'],
            ['name' => 'delete_users', 'display_name' => 'Supprimer des utilisateurs', 'group' => 'Utilisateurs'],
            ['name' => 'manage_user_roles', 'display_name' => 'Gérer les rôles des utilisateurs', 'group' => 'Utilisateurs'],
            
            // Rôles
            ['name' => 'view_roles', 'display_name' => 'Voir les rôles', 'group' => 'Rôles'],
            ['name' => 'create_roles', 'display_name' => 'Créer des rôles', 'group' => 'Rôles'],
            ['name' => 'edit_roles', 'display_name' => 'Modifier les rôles', 'group' => 'Rôles'],
            ['name' => 'delete_roles', 'display_name' => 'Supprimer des rôles', 'group' => 'Rôles'],
            
            // Permissions
            ['name' => 'view_permissions', 'display_name' => 'Voir les permissions', 'group' => 'Permissions'],
            ['name' => 'manage_role_permissions', 'display_name' => 'Gérer les permissions des rôles', 'group' => 'Permissions'],
            
            // Cours
            ['name' => 'view_courses', 'display_name' => 'Voir les cours', 'group' => 'Cours'],
            ['name' => 'create_courses', 'display_name' => 'Créer des cours', 'group' => 'Cours'],
            ['name' => 'edit_courses', 'display_name' => 'Modifier les cours', 'group' => 'Cours'],
            ['name' => 'delete_courses', 'display_name' => 'Supprimer des cours', 'group' => 'Cours'],
            ['name' => 'publish_courses', 'display_name' => 'Publier des cours', 'group' => 'Cours'],
            
            // Devoirs
            ['name' => 'view_assignments', 'display_name' => 'Voir les devoirs', 'group' => 'Devoirs'],
            ['name' => 'create_assignments', 'display_name' => 'Créer des devoirs', 'group' => 'Devoirs'],
            ['name' => 'edit_assignments', 'display_name' => 'Modifier les devoirs', 'group' => 'Devoirs'],
            ['name' => 'delete_assignments', 'display_name' => 'Supprimer des devoirs', 'group' => 'Devoirs'],
            
            // Soumissions
            ['name' => 'view_submissions', 'display_name' => 'Voir les soumissions', 'group' => 'Soumissions'],
            ['name' => 'submit_assignments', 'display_name' => 'Soumettre des devoirs', 'group' => 'Soumissions'],
            ['name' => 'grade_submissions', 'display_name' => 'Noter les soumissions', 'group' => 'Soumissions'],
            
            // Notes
            ['name' => 'view_grades', 'display_name' => 'Voir les notes', 'group' => 'Notes'],
            ['name' => 'manage_grades', 'display_name' => 'Gérer les notes', 'group' => 'Notes'],
            
            // Annonces
            ['name' => 'view_announcements', 'display_name' => 'Voir les annonces', 'group' => 'Annonces'],
            ['name' => 'create_announcements', 'display_name' => 'Créer des annonces', 'group' => 'Annonces'],
            ['name' => 'edit_announcements', 'display_name' => 'Modifier les annonces', 'group' => 'Annonces'],
            ['name' => 'delete_announcements', 'display_name' => 'Supprimer des annonces', 'group' => 'Annonces'],
            
            // Messages
            ['name' => 'send_messages', 'display_name' => 'Envoyer des messages', 'group' => 'Messages'],
            ['name' => 'view_messages', 'display_name' => 'Voir les messages', 'group' => 'Messages'],
            ['name' => 'delete_messages', 'display_name' => 'Supprimer des messages', 'group' => 'Messages'],
            
            // Paramètres
            ['name' => 'manage_settings', 'display_name' => 'Gérer les paramètres', 'group' => 'Paramètres'],
        ];

        // Créer les permissions
        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        // Attribuer toutes les permissions au rôle admin
        $adminRole->permissions()->attach(Permission::all());

        // Permissions pour les enseignants
        $teacherPermissions = [
            'view_courses', 'create_courses', 'edit_courses', 'delete_courses', 'publish_courses',
            'view_assignments', 'create_assignments', 'edit_assignments', 'delete_assignments',
            'view_submissions', 'grade_submissions',
            'view_grades', 'manage_grades',
            'view_announcements', 'create_announcements', 'edit_announcements',
            'send_messages', 'view_messages', 'delete_messages',
        ];
        $teacherRole->permissions()->attach(Permission::whereIn('name', $teacherPermissions)->get());

        // Permissions pour les étudiants
        $studentPermissions = [
            'view_courses',
            'view_assignments', 'submit_assignments',
            'view_grades',
            'view_announcements',
            'send_messages', 'view_messages', 'delete_messages',
        ];
        $studentRole->permissions()->attach(Permission::whereIn('name', $studentPermissions)->get());
    }
}
