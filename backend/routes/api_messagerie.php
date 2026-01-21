<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Messagerie\ConversationController;
use App\Http\Controllers\Api\Messagerie\MessageController;

/*
|--------------------------------------------------------------------------
| API Routes pour la messagerie interne
|--------------------------------------------------------------------------
|
| Ces routes gèrent toutes les fonctionnalités de messagerie interne
|
*/

Route::middleware('auth:sanctum')->group(function () {

    // Routes pour les conversations
    Route::prefix('conversations')->group(function () {
        Route::get('/', [ConversationController::class, 'index']); // Lister les conversations
        Route::get('/par-cours', [ConversationController::class, 'getConversationsParCours']); // Conversations groupées par cours
        Route::post('/', [ConversationController::class, 'store']); // Créer une conversation
        Route::get('/{conversation}', [ConversationController::class, 'show']); // Voir une conversation
        Route::put('/{conversation}', [ConversationController::class, 'update']); // Modifier une conversation
        Route::delete('/{conversation}', [ConversationController::class, 'destroy']); // Supprimer une conversation
        
        // Gestion des participants
        Route::post('/{conversation}/participants', [ConversationController::class, 'ajouterParticipant']); // Ajouter un participant
        Route::delete('/{conversation}/participants', [ConversationController::class, 'retirerParticipant']); // Retirer un participant
        
        // Gestion de la lecture
        Route::put('/{conversation}/marquer-lue', [ConversationController::class, 'marquerCommeLue']); // Marquer comme lue
    });

    // Routes pour les messages
    Route::prefix('messages')->group(function () {
        Route::get('/tags', [MessageController::class, 'rechercherTags']); // Lister les tags disponibles
        Route::get('/par-tag', [MessageController::class, 'getMessagesParTag']); // Messages par tag
        
        // Routes spécifiques à une conversation
        Route::get('/conversations/{conversation}', [MessageController::class, 'index']); // Messages d'une conversation
        Route::post('/conversations/{conversation}', [MessageController::class, 'store']); // Envoyer un message
        
        // Routes pour les messages individuels
        Route::get('/{message}', [MessageController::class, 'show']); // Voir un message
        Route::put('/{message}', [MessageController::class, 'update']); // Modifier un message
        Route::delete('/{message}', [MessageController::class, 'destroy']); // Supprimer un message
        
        // Gestion des tags
        Route::post('/{message}/tags', [MessageController::class, 'ajouterTag']); // Ajouter un tag
        Route::delete('/{message}/tags', [MessageController::class, 'supprimerTag']); // Supprimer un tag
        
        // Téléchargement de fichiers
        Route::get('/{message}/telecharger', [MessageController::class, 'telechargerFichier']); // Télécharger un fichier
    });

});
