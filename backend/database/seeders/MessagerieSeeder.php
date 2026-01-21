<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cours;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageTag;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MessagerieSeeder extends Seeder
{
    public function run(): void
    {
        // Créer des conversations de test
        $this->creerConversationsPrivees();
        $this->creerConversationsGroupe();
        $this->creerConversationsMatiere();
        $this->creerMessagesExemple();
        $this->creerTagsExemple();

        $this->command->info('Données de test pour la messagerie créées avec succès!');
    }

    private function creerConversationsPrivees(): void
    {
        // Conversations privées étudiant ↔ enseignant
        $etudiants = User::whereHas('roles', function ($query) {
            $query->where('name', 'etudiant');
        })->take(5)->get();

        $enseignants = User::whereHas('roles', function ($query) {
            $query->where('name', 'enseignant');
        })->take(3)->get();

        foreach ($etudiants as $etudiant) {
            foreach ($enseignants as $enseignant) {
                $conversation = Conversation::create([
                    'titre' => "Discussion privée - {$etudiant->name} & {$enseignant->name}",
                    'description' => "Conversation privée entre {$etudiant->name} et {$enseignant->name}",
                    'type' => 'prive',
                    'createur_id' => $etudiant->id,
                    'statut' => 'actif',
                    'nombre_participants' => 2,
                    'visible' => true
                ]);

                // Ajouter les participants
                $conversation->ajouterParticipant($etudiant->id, 'admin');
                $conversation->ajouterParticipant($enseignant->id, 'admin');

                // Ajouter quelques messages
                $this->ajouterMessagesConversation($conversation, [$etudiant->id, $enseignant->id]);
            }
        }
    }

    private function creerConversationsGroupe(): void
    {
        // Groupes de discussion par projet
        $projets = [
            ['titre' => 'Projet Web - Groupe A', 'description' => 'Discussion pour le projet de développement web'],
            ['titre' => 'Projet Mobile - Groupe B', 'description' => 'Discussion pour le projet de développement mobile'],
            ['titre' => 'Projet Data Science - Groupe C', 'description' => 'Discussion pour le projet de data science'],
        ];

        foreach ($projets as $projet) {
            $conversation = Conversation::create([
                'titre' => $projet['titre'],
                'description' => $projet['description'],
                'type' => 'groupe',
                'createur_id' => 1, // Admin
                'statut' => 'actif',
                'nombre_participants' => 5,
                'visible' => true
            ]);

            // Ajouter des participants aléatoires
            $participants = User::inRandomOrder()->take(5)->pluck('id');
            foreach ($participants as $participantId) {
                $role = $participantId === 1 ? 'admin' : 'membre';
                $conversation->ajouterParticipant($participantId, $role);
            }

            // Ajouter des messages
            $this->ajouterMessagesConversation($conversation, $participants->toArray());
        }
    }

    private function creerConversationsMatiere(): void
    {
        // Conversations par matière
        $cours = Cours::take(3)->get();

        foreach ($cours as $cour) {
            $conversation = Conversation::create([
                'titre' => "Discussion - {$cour->titre}",
                'description' => "Espace de discussion pour la matière {$cour->titre}",
                'type' => 'matiere',
                'cours_id' => $cour->id,
                'createur_id' => 1, // Admin
                'statut' => 'actif',
                'nombre_participants' => 8,
                'visible' => true
            ]);

            // Ajouter l'enseignant du cours comme modérateur
            if ($cour->instructeur_id) {
                $conversation->ajouterParticipant($cour->instructeur_id, 'moderateur');
            }

            // Ajouter des étudiants
            $etudiants = User::whereHas('roles', function ($query) {
                $query->where('name', 'etudiant');
            })->inRandomOrder()->take(7)->pluck('id');

            foreach ($etudiants as $etudiantId) {
                $conversation->ajouterParticipant($etudiantId, 'membre');
            }

            // Ajouter des messages
            $participants = $etudiants->toArray();
            if ($cour->instructeur_id) {
                $participants[] = $cour->instructeur_id;
            }
            $this->ajouterMessagesConversation($conversation, $participants);
        }
    }

    private function ajouterMessagesConversation(Conversation $conversation, array $participantIds): void
    {
        $messagesExemples = [
            "Bonjour tout le monde !",
            "Comment allez-vous aujourd'hui ?",
            "J'ai une question concernant le projet",
            "Quelqu'un a compris la partie 3 de l'exercice ?",
            "Je pense que nous devrions nous réunir pour discuter du projet",
            "Les documents sont disponibles sur la plateforme",
            "N'oubliez pas la date limite pour rendre le devoir",
            "Pouvez-vous m'aider avec ce problème ?",
            "Merci pour votre aide !",
            "Bonne journée à tous",
            "J'ai partagé les ressources utiles dans le chat",
            "N'hésitez pas à poser vos questions",
            "La séance de tutorat est prévue pour demain",
            "Les résultats seront publiés bientôt",
            "Félicitations pour votre excellent travail !"
        ];

        $nombreMessages = rand(5, 15);
        for ($i = 0; $i < $nombreMessages; $i++) {
            $expediteurId = $participantIds[array_rand($participantIds)];
            $contenu = $messagesExemples[array_rand($messagesExemples)];
            
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'expediteur_id' => $expediteurId,
                'contenu' => $contenu,
                'type' => 'texte',
                'date_envoi' => now()->subMinutes(rand(1, 1440)), // Messages sur les dernières 24h
                'visible' => true
            ]);

            // Ajouter des tags aléatoires
            if (rand(0, 1)) { // 50% de chance d'avoir un tag
                $tags = ['#urgent', '#annonce', '#projet', '#information', '#question'];
                $tag = $tags[array_rand($tags)];
                $couleur = MessageTag::getCouleurTag($tag);
                
                MessageTag::create([
                    'message_id' => $message->id,
                    'user_id' => $expediteurId,
                    'tag' => $tag,
                    'couleur' => $couleur,
                    'date_creation' => now()
                ]);
            }
        }
    }

    private function creerMessagesExemple(): void
    {
        // Messages avec différents types
        $conversations = Conversation::take(5)->get();

        foreach ($conversations as $conversation) {
            $participants = $conversation->participants()->pluck('user_id')->toArray();
            
            // Message avec fichier
            if (rand(0, 1)) {
                $expediteurId = $participants[array_rand($participants)];
                Message::create([
                    'conversation_id' => $conversation->id,
                    'expediteur_id' => $expediteurId,
                    'contenu' => "📎 Voici le document demandé : rapport.pdf",
                    'type' => 'fichier',
                    'fichier_path' => 'messages/fichiers/rapport.pdf',
                    'fichier_nom' => 'rapport.pdf',
                    'fichier_taille' => '2.5 MB',
                    'date_envoi' => now()->subHours(rand(1, 12)),
                    'visible' => true
                ]);
            }

            // Message avec lien
            if (rand(0, 1)) {
                $expediteurId = $participants[array_rand($participants)];
                Message::create([
                    'conversation_id' => $conversation->id,
                    'expediteur_id' => $expediteurId,
                    'contenu' => "🔗 Ressource utile : Documentation complète",
                    'type' => 'lien',
                    'lien_url' => 'https://documentation.example.com',
                    'lien_titre' => 'Documentation complète',
                    'date_envoi' => now()->subHours(rand(1, 12)),
                    'visible' => true
                ]);
            }
        }
    }

    private function creerTagsExemple(): void
    {
        // Créer des tags supplémentaires pour les messages existants
        $messages = Message::take(20)->get();

        foreach ($messages as $message) {
            if (rand(0, 1)) { // 50% de chance d'ajouter un tag
                $tags = ['#urgent', '#annonce', '#projet', '#information', '#question', '#reunion', '#devoir', '#examen'];
                $tag = $tags[array_rand($tags)];
                $couleur = MessageTag::getCouleurTag($tag);
                
                MessageTag::create([
                    'message_id' => $message->id,
                    'user_id' => $message->expediteur_id,
                    'tag' => $tag,
                    'couleur' => $couleur,
                    'date_creation' => now()
                ]);
            }
        }
    }
}
