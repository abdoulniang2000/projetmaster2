<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Departement;
use App\Models\Module;
use App\Models\Matiere;
use App\Models\Semestre;
use App\Models\Cours;
use App\Models\Devoir;
use App\Models\Soumission;
use App\Models\Note;
use App\Models\Annonce;
use App\Models\Forum;
use App\Models\Discussion;
use App\Models\Reponse;
use App\Models\Fichier;
use App\Models\Notification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Désactiver les contraintes de clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Vider les tables
        $this->truncateTables();
        
        // Activer les contraintes de clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        // Créer les rôles
        $this->createRoles();
        
        // Créer les départements
        $this->createDepartements();
        
        // Créer les utilisateurs
        $this->createUsers();
        
        // Créer les semestres
        $this->createSemestres();
        
        // Créer les modules et matières
        $this->createModulesAndMatieres();
        
        // Créer les cours
        $this->createCours();
        
        // Inscrire les étudiants aux cours
        $this->enrollStudents();
        
        // Créer les devoirs
        $this->createDevoirs();
        
        // Créer les soumissions et notes
        $this->createSoumissionsAndNotes();
        
        // Créer les annonces
        $this->createAnnonces();
        
        // Créer les forums
        $this->createForums();
        
        // Créer les fichiers
        $this->createFichiers();
        
        // Créer les notifications
        $this->createNotifications();
    }
    
    private function truncateTables()
    {
        $tables = [
            'notifications', 'fichiers', 'reponses', 'discussions', 'forums',
            'annonces', 'notes', 'soumissions', 'devoirs', 'cours_etudiants',
            'cours', 'matieres', 'modules', 'semestres', 'user_roles',
            'users', 'roles', 'departements'
        ];
        
        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }
    }
    
    private function createRoles()
    {
        Role::create(['name' => 'admin', 'description' => 'Administrateur', 'is_default' => false]);
        Role::create(['name' => 'enseignant', 'description' => 'Enseignant', 'is_default' => false]);
        Role::create(['name' => 'etudiant', 'description' => 'Étudiant', 'is_default' => true]);
    }
    
    private function createDepartements()
    {
        Departement::create([
            'nom' => 'Informatique',
            'description' => 'Département d\'informatique',
            'code' => 'INFO'
        ]);
        
        Departement::create([
            'nom' => 'Mathématiques',
            'description' => 'Département de mathématiques',
            'code' => 'MATH'
        ]);
    }
    
    private function createUsers()
    {
        // Administrateur
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'System',
            'username' => 'admin',
            'email' => 'admin@mastercampus.sn',
            'password' => Hash::make('password'),
            'status' => true
        ]);
        $admin->roles()->attach(Role::where('name', 'admin')->first());
        
        // Enseignants
        $enseignant1 = User::create([
            'first_name' => 'Moussa',
            'last_name' => 'Diop',
            'username' => 'moussa.diop',
            'email' => 'moussa.diop@mastercampus.sn',
            'password' => Hash::make('password'),
            'status' => true
        ]);
        $enseignant1->roles()->attach(Role::where('name', 'enseignant')->first());
        
        $enseignant2 = User::create([
            'first_name' => 'Fatou',
            'last_name' => 'Sow',
            'username' => 'fatou.sow',
            'email' => 'fatou.sow@mastercampus.sn',
            'password' => Hash::make('password'),
            'status' => true
        ]);
        $enseignant2->roles()->attach(Role::where('name', 'enseignant')->first());
        
        // Étudiants
        $etudiants = [
            ['first_name' => 'Abdou', 'last_name' => 'Niang', 'username' => 'abdou.niang', 'email' => 'abdou.niang@mastercampus.sn'],
            ['first_name' => 'Aïcha', 'last_name' => 'Ba', 'username' => 'aicha.ba', 'email' => 'aicha.ba@mastercampus.sn'],
            ['first_name' => 'Mamadou', 'last_name' => 'Fall', 'username' => 'mamadou.fall', 'email' => 'mamadou.fall@mastercampus.sn'],
            ['first_name' => 'Mariam', 'last_name' => 'Diallo', 'username' => 'mariam.diallo', 'email' => 'mariam.diallo@mastercampus.sn'],
            ['first_name' => 'Ibrahim', 'last_name' => 'Ly', 'username' => 'ibrahim.ly', 'email' => 'ibrahim.ly@mastercampus.sn'],
        ];
        
        foreach ($etudiants as $etudiant) {
            $user = User::create([
                'first_name' => $etudiant['first_name'],
                'last_name' => $etudiant['last_name'],
                'username' => $etudiant['username'],
                'email' => $etudiant['email'],
                'password' => Hash::make('password'),
                'status' => true
            ]);
            $user->roles()->attach(Role::where('name', 'etudiant')->first());
        }
    }
    
    private function createSemestres()
    {
        Semestre::create(['nom' => 'Semestre 1', 'code' => 'S1', 'ordre' => 1]);
        Semestre::create(['nom' => 'Semestre 2', 'code' => 'S2', 'ordre' => 2]);
        Semestre::create(['nom' => 'Semestre 3', 'code' => 'S3', 'ordre' => 3]);
        Semestre::create(['nom' => 'Semestre 4', 'code' => 'S4', 'ordre' => 4]);
    }
    
    private function createModulesAndMatieres()
    {
        // Module 1: Développement Web
        $module1 = Module::create([
            'nom' => 'Développement Web',
            'code' => 'DW',
            'description' => 'Technologies web modernes',
            'semestre_id' => 1
        ]);
        
        Matiere::create([
            'nom' => 'HTML/CSS',
            'code' => 'HTML',
            'description' => 'Structures et styles web',
            'module_id' => $module1->id
        ]);
        
        Matiere::create([
            'nom' => 'JavaScript',
            'code' => 'JS',
            'description' => 'Programmation web côté client',
            'module_id' => $module1->id
        ]);
        
        // Module 2: Base de données
        $module2 = Module::create([
            'nom' => 'Base de Données',
            'code' => 'BD',
            'description' => 'Conception et gestion de bases de données',
            'semestre_id' => 1
        ]);
        
        Matiere::create([
            'nom' => 'SQL',
            'code' => 'SQL',
            'description' => 'Langage de requêtes structurées',
            'module_id' => $module2->id
        ]);
        
        Matiere::create([
            'nom' => 'NoSQL',
            'code' => 'NOSQL',
            'description' => 'Bases de données non relationnelles',
            'module_id' => $module2->id
        ]);
    }
    
    private function createCours()
    {
        $enseignant1 = User::where('email', 'moussa.diop@mastercampus.sn')->first();
        $enseignant2 = User::where('email', 'fatou.sow@mastercampus.sn')->first();
        
        // Cours 1: HTML/CSS
        Cours::create([
            'nom' => 'HTML/CSS Avancé',
            'description' => 'Apprentissage approfondi du HTML5 et CSS3',
            'enseignant_id' => $enseignant1->id,
            'module_id' => 1,
            'matiere_id' => 1,
            'semestre_id' => 1,
            'code' => 'HTML101',
            'credits' => 3,
            'is_active' => true
        ]);
        
        // Cours 2: JavaScript
        Cours::create([
            'nom' => 'JavaScript Moderne',
            'description' => 'ES6+ et frameworks JavaScript',
            'enseignant_id' => $enseignant1->id,
            'module_id' => 1,
            'matiere_id' => 2,
            'semestre_id' => 1,
            'code' => 'JS101',
            'credits' => 4,
            'is_active' => true
        ]);
        
        // Cours 3: SQL
        Cours::create([
            'nom' => 'SQL et Modélisation',
            'description' => 'Conception de schémas et requêtes SQL avancées',
            'enseignant_id' => $enseignant2->id,
            'module_id' => 2,
            'matiere_id' => 3,
            'semestre_id' => 1,
            'code' => 'SQL101',
            'credits' => 3,
            'is_active' => true
        ]);
    }
    
    private function enrollStudents()
    {
        $etudiants = User::whereHas('roles', function($q) {
            $q->where('name', 'etudiant');
        })->get();
        
        $cours = Cours::all();
        
        foreach ($etudiants as $etudiant) {
            // Inscrire chaque étudiant à 2-3 cours
            $coursAInscrire = $cours->random(rand(2, 3));
            
            foreach ($coursAInscrire as $cour) {
                $etudiant->coursInscrits()->attach($cour->id, [
                    'date_inscription' => now(),
                    'statut' => 'actif'
                ]);
            }
        }
    }
    
    private function createDevoirs()
    {
        $cours = Cours::all();
        
        foreach ($cours as $cour) {
            // Créer 2-3 devoirs par cours
            for ($i = 1; $i <= rand(2, 3); $i++) {
                Devoir::create([
                    'titre' => "Devoir {$i} - {$cour->nom}",
                    'description' => "Description du devoir {$i} pour le cours {$cour->nom}",
                    'type' => ['projet', 'exercice', 'quiz'][array_rand(['projet', 'exercice', 'quiz'])],
                    'cours_id' => $cour->id,
                    'instructeur_id' => $cour->enseignant_id,
                    'date_publication' => now()->subDays(rand(5, 10)),
                    'date_limite' => now()->addDays(rand(5, 15)),
                    'ponderation' => rand(10, 30),
                    'instructions' => "Instructions détaillées pour le devoir {$i}",
                    'visible' => true
                ]);
            }
        }
    }
    
    private function createSoumissionsAndNotes()
    {
        $etudiants = User::whereHas('roles', function($q) {
            $q->where('name', 'etudiant');
        })->get();
        
        $devoirs = Devoir::where('date_limite', '<', now())->get();
        
        foreach ($devoirs as $devoir) {
            // 60-80% des étudiants soumettent
            $etudiantsQuiSoumettent = $etudiants->random(
                max(1, intval($etudiants->count() * rand(60, 80) / 100))
            );
            
            foreach ($etudiantsQuiSoumettent as $etudiant) {
                // Vérifier si l'étudiant est inscrit au cours du devoir
                if ($etudiant->coursInscrits()->where('cours.id', $devoir->cours_id)->exists()) {
                    $soumission = Soumission::create([
                        'devoir_id' => $devoir->id,
                        'etudiant_id' => $etudiant->id,
                        'fichier_soumis' => "soumissions/devoir_{$devoir->id}_{$etudiant->id}.pdf",
                        'date_soumission' => $devoir->date_limite->subDays(rand(1, 5))
                    ]);
                    
                    // Ajouter une note pour 80% des soumissions
                    if (rand(1, 100) <= 80) {
                        Note::create([
                            'soumission_id' => $soumission->id,
                            'evaluateur_id' => $devoir->instructeur_id,
                            'note' => rand(8, 18),
                            'commentaire' => "Bon travail, quelques améliorations possibles."
                        ]);
                    }
                }
            }
        }
    }
    
    private function createAnnonces()
    {
        $enseignants = User::whereHas('roles', function($q) {
            $q->where('name', 'enseignant');
        })->get();
        
        $cours = Cours::all();
        
        foreach ($enseignants as $enseignant) {
            $coursEnseignes = $enseignant->coursEnseignes;
            
            foreach ($coursEnseignes as $cour) {
                // Créer 1-2 annonces par cours
                for ($i = 1; $i <= rand(1, 2); $i++) {
                    Annonce::create([
                        'titre' => "Annonce importante - {$cour->nom}",
                        'contenu' => "Contenu de l'annonce {$i} pour le cours {$cour->nom}",
                        'type' => ['general', 'cours', 'urgence'][array_rand(['general', 'cours', 'urgence'])],
                        'cours_id' => $cour->id,
                        'created_by' => $enseignant->id,
                        'is_active' => true,
                        'published_at' => now()->subDays(rand(1, 7))
                    ]);
                }
            }
        }
    }
    
    private function createForums()
    {
        $cours = Cours::all();
        
        foreach ($cours as $cour) {
            // Créer un forum par cours
            $forum = Forum::create([
                'titre' => "Forum - {$cour->nom}",
                'description' => "Espace de discussion pour le cours {$cour->nom}",
                'cours_id' => $cour->id,
                'created_by' => $cour->enseignant_id,
                'is_active' => true
            ]);
            
            // Créer quelques discussions
            $etudiants = User::whereHas('roles', function($q) {
                $q->where('name', 'etudiant');
            })->get();
            
            for ($i = 1; $i <= rand(2, 4); $i++) {
                $etudiant = $etudiants->random();
                
                if ($etudiant->coursInscrits()->where('cours.id', $cour->id)->exists()) {
                    $discussion = Discussion::create([
                        'titre' => "Question {$i} sur {$cour->nom}",
                        'contenu' => "J'ai une question concernant le cours {$cour->nom}",
                        'forum_id' => $forum->id,
                        'user_id' => $etudiant->id
                    ]);
                    
                    // Ajouter quelques réponses
                    for ($j = 1; $j <= rand(1, 3); $j++) {
                        $repondeur = $j == 1 ? $cour->enseignant : $etudiants->random();
                        
                        Reponse::create([
                            'contenu' => "Réponse {$j} à la question",
                            'discussion_id' => $discussion->id,
                            'user_id' => $repondeur->id,
                            'is_best_answer' => $j == 1 && rand(1, 100) <= 30
                        ]);
                    }
                }
            }
        }
    }
    
    private function createFichiers()
    {
        $cours = Cours::all();
        $enseignants = User::whereHas('roles', function($q) {
            $q->where('name', 'enseignant');
        })->get();
        
        foreach ($cours as $cour) {
            // Créer 2-4 fichiers par cours
            for ($i = 1; $i <= rand(2, 4); $i++) {
                Fichier::create([
                    'nom' => "Support_{$i}_{$cour->code}.pdf",
                    'chemin' => "fichiers/support_{$i}_{$cour->code}.pdf",
                    'type' => 'application/pdf',
                    'taille' => rand(500000, 2000000),
                    'fichierable_type' => Cours::class,
                    'fichierable_id' => $cour->id,
                    'uploaded_by' => $cour->enseignant_id
                ]);
            }
        }
    }
    
    private function createNotifications()
    {
        $etudiants = User::whereHas('roles', function($q) {
            $q->where('name', 'etudiant');
        })->get();
        
        foreach ($etudiants as $etudiant) {
            // Créer 3-5 notifications par étudiant
            for ($i = 1; $i <= rand(3, 5); $i++) {
                Notification::create([
                    'type' => ['devoir_publie', 'note_publiee', 'deadline_approche', 'annonce'][array_rand(['devoir_publie', 'note_publiee', 'deadline_approche', 'annonce'])],
                    'titre' => "Notification {$i}",
                    'contenu' => "Contenu de la notification {$i}",
                    'notifiable_type' => User::class,
                    'notifiable_id' => $etudiant->id,
                    'metadonnees' => ['test' => true],
                    'is_push' => rand(1, 100) <= 70,
                    'is_email' => rand(1, 100) <= 30,
                    'read_at' => rand(1, 100) <= 40 ? now()->subHours(rand(1, 24)) : null
                ]);
            }
        }
    }
}
