<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cours;
use App\Models\Support;
use App\Models\Devoir;
use App\Models\Soumission;
use App\Models\Forum;
use App\Models\ForumMessage;
use App\Models\Evenement;
use App\Models\Notification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EtudiantSeeder extends Seeder
{
    public function run(): void
    {
        // Créer des étudiants de test
        $etudiants = [];
        for ($i = 1; $i <= 10; $i++) {
            $etudiant = User::create([
                'name' => "Étudiant Test {$i}",
                'email' => "etudiant{$i}@test.com",
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]);

            // Assigner le rôle étudiant
            $etudiant->assignRole('etudiant');
            $etudiants[] = $etudiant;
        }

        // Créer des supports de cours
        $types = ['pdf', 'ppt', 'video', 'image', 'document'];
        $categories = ['Cours', 'Exercices', 'Corrigés', 'Ressources', 'Examens'];
        
        for ($i = 1; $i <= 20; $i++) {
            Support::create([
                'titre' => "Support de cours {$i}",
                'description' => "Description du support de cours {$i}",
                'type' => $types[$i % count($types)],
                'fichier_path' => "supports/support_{$i}.pdf",
                'fichier_nom' => "support_{$i}.pdf",
                'fichier_taille' => ($i % 10 + 1) . " MB",
                'cours_id' => $i % 5 + 1,
                'instructeur_id' => 1, // Supposer que l'admin a l'ID 1
                'date_ajout' => now()->subDays($i),
                'nombre_telechargements' => rand(10, 100),
                'categorie' => $categories[$i % count($categories)],
                'visible' => true
            ]);
        }

        // Créer des devoirs
        $devoirTypes = ['devoir', 'projet', 'examen'];
        
        for ($i = 1; $i <= 15; $i++) {
            $devoir = Devoir::create([
                'titre' => "Devoir {$i}",
                'description' => "Description du devoir {$i}",
                'type' => $devoirTypes[$i % count($devoirTypes)],
                'cours_id' => $i % 5 + 1,
                'instructeur_id' => 1,
                'date_publication' => now()->subDays($i),
                'date_limite' => now()->addDays(15 - $i),
                'ponderation' => 20,
                'instructions' => "Instructions pour le devoir {$i}",
                'visible' => true
            ]);

            // Créer des soumissions pour certains devoirs
            if ($i % 2 == 0) {
                foreach ($etudiants as $index => $etudiant) {
                    if ($index % 3 == 0) { // Un tiers des étudiants soumettent
                        Soumission::create([
                            'devoir_id' => $devoir->id,
                            'etudiant_id' => $etudiant->id,
                            'fichier_path' => "soumissions/devoir_{$i}_etudiant_{$etudiant->id}.pdf",
                            'fichier_nom' => "devoir_{$i}_etudiant_{$etudiant->id}.pdf",
                            'fichier_taille' => "2 MB",
                            'commentaire' => "Voici ma soumission pour le devoir {$i}",
                            'version' => 1,
                            'statut' => rand(0, 1) ? 'en_attente' : 'corrige',
                            'note' => rand(12, 18),
                            'feedback' => "Bon travail, quelques améliorations possibles.",
                            'date_soumission' => now()->subDays(rand(1, 10)),
                            'date_correction' => now()->subDays(rand(1, 5)),
                            'correcteur_id' => 1
                        ]);
                    }
                }
            }
        }

        // Créer des forums
        $forumCategories = ['General', 'Questions techniques', 'Projets', 'Examens', 'Ressources'];
        
        for ($i = 1; $i <= 10; $i++) {
            $forum = Forum::create([
                'titre' => "Forum de discussion {$i}",
                'description' => "Description du forum {$i}",
                'cours_id' => $i % 5 + 1,
                'createur_id' => $etudiants[$i % count($etudiants)]->id,
                'categorie' => $forumCategories[$i % count($forumCategories)],
                'statut' => 'ouvert',
                'nombre_messages' => rand(5, 20),
                'nombre_participants' => rand(3, 10),
                'date_creation' => now()->subDays($i),
                'dernier_message_date' => now()->subHours($i),
                'dernier_message_auteur' => "Étudiant " . ($i % 5 + 1),
                'dernier_message_contenu' => "Dernier message du forum {$i}",
                'visible' => true
            ]);

            // Créer des messages pour chaque forum
            for ($j = 1; $j <= 5; $j++) {
                $message = ForumMessage::create([
                    'forum_id' => $forum->id,
                    'auteur_id' => $etudiants[$j % count($etudiants)]->id,
                    'contenu' => "Message {$j} du forum {$i}",
                    'parent_id' => null,
                    'nombre_likes' => rand(0, 10),
                    'date_creation' => now()->subHours($i * $j),
                    'visible' => true
                ]);

                // Ajouter des réponses
                if ($j % 2 == 0) {
                    ForumMessage::create([
                        'forum_id' => $forum->id,
                        'auteur_id' => $etudiants[($j + 1) % count($etudiants)]->id,
                        'contenu' => "Réponse au message {$j} du forum {$i}",
                        'parent_id' => $message->id,
                        'nombre_likes' => rand(0, 5),
                        'date_creation' => now()->subHours($i * $j + 1),
                        'visible' => true
                    ]);
                }
            }
        }

        // Créer des événements
        $eventTypes = ['cours', 'devoir', 'examen', 'reunion', 'webinaire'];
        
        for ($i = 1; $i <= 12; $i++) {
            Evenement::create([
                'titre' => "Événement {$i}",
                'description' => "Description de l'événement {$i}",
                'type' => $eventTypes[$i % count($eventTypes)],
                'date' => now()->addDays($i - 6),
                'heure_debut' => now()->setTime(8 + ($i % 8), 0, 0),
                'heure_fin' => now()->setTime(10 + ($i % 8), 0, 0),
                'lieu' => $i % 2 == 0 ? "Salle " . (100 + $i) : null,
                'lien' => $i % 2 == 1 ? "https://meet.example.com/room-{$i}" : null,
                'cours_id' => $i % 5 + 1,
                'instructeur_id' => 1,
                'statut' => 'a_venir',
                'rappel' => $i % 3 == 0,
                'priorite' => ['basse', 'moyenne', 'haute'][$i % 3],
                'date_creation' => now()->subDays($i),
                'visible' => true
            ]);
        }

        // Créer des notifications pour chaque étudiant
        $notificationTypes = ['info', 'success', 'warning', 'error'];
        $notificationCategories = ['cours', 'devoir', 'note', 'forum', 'systeme'];
        
        foreach ($etudiants as $etudiant) {
            for ($i = 1; $i <= 10; $i++) {
                Notification::create([
                    'titre' => "Notification {$i} pour {$etudiant->name}",
                    'message' => "Message de la notification {$i}",
                    'type' => $notificationTypes[$i % count($notificationTypes)],
                    'categorie' => $notificationCategories[$i % count($notificationCategories)],
                    'user_id' => $etudiant->id,
                    'lue' => $i % 3 != 0, // 2/3 des notifications sont non lues
                    'priorite' => ['basse', 'moyenne', 'haute'][$i % 3],
                    'action_url' => "/dashboard/etudiant/cours",
                    'action_label' => "Voir les détails",
                    'date_creation' => now()->subHours($i),
                    'expire_le' => now()->addDays(7),
                    'visible' => true
                ]);
            }
        }

        $this->command->info('Données de test pour l\'espace étudiant créées avec succès!');
    }
}
