<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SupportController;
use App\Http\Controllers\Api\DevoirController;
use App\Http\Controllers\Api\SoumissionController;
use App\Http\Controllers\Api\ForumController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes pour l'espace étudiant
|--------------------------------------------------------------------------
|
| Ces routes gèrent toutes les fonctionnalités de l'espace étudiant
|
*/

Route::middleware('auth:sanctum')->group(function () {

    // Routes pour les supports de cours
    Route::prefix('supports')->group(function () {
        Route::get('/', [SupportController::class, 'index']); // Lister tous les supports
        Route::get('/{support}', [SupportController::class, 'show']); // Voir un support
        Route::get('/{support}/download', [SupportController::class, 'download']); // Télécharger un support
    });

    // Routes pour les devoirs
    Route::prefix('devoirs')->group(function () {
        Route::get('/', [DevoirController::class, 'index']); // Lister tous les devoirs
        Route::get('/mes-devoirs', [DevoirController::class, 'mesDevoirs']); // Mes devoirs (étudiant)
        Route::get('/{devoir}', [DevoirController::class, 'show']); // Voir un devoir
        
        // Routes pour les instructeurs uniquement
        Route::middleware('role:enseignant,admin')->group(function () {
            Route::post('/', [DevoirController::class, 'store']); // Créer un devoir
            Route::put('/{devoir}', [DevoirController::class, 'update']); // Modifier un devoir
            Route::delete('/{devoir}', [DevoirController::class, 'destroy']); // Supprimer un devoir
        });
    });

    // Routes pour les soumissions de devoirs
    Route::prefix('soumissions')->group(function () {
        Route::get('/', [SoumissionController::class, 'mesSoumissions']); // Mes soumissions
        Route::post('/', [SoumissionController::class, 'store']); // Soumettre un devoir
        Route::get('/{soumission}', [SoumissionController::class, 'show']); // Voir une soumission
        Route::get('/{soumission}/download', [SoumissionController::class, 'download']); // Télécharger une soumission
        Route::put('/{soumission}', [SoumissionController::class, 'update']); // Mettre à jour une soumission (nouvelle version)
        Route::delete('/{soumission}', [SoumissionController::class, 'destroy']); // Supprimer une soumission
    });

    // Routes pour les forums
    Route::prefix('forums')->group(function () {
        Route::get('/', [ForumController::class, 'index']); // Lister tous les forums
        Route::post('/', [ForumController::class, 'store']); // Créer un forum
        Route::get('/{forum}', [ForumController::class, 'show']); // Voir un forum
        Route::get('/{forum}/messages', [ForumController::class, 'messages']); // Messages d'un forum
        Route::post('/{forum}/messages', [ForumController::class, 'addMessage']); // Ajouter un message
        Route::post('/messages/{message}/like', [ForumController::class, 'likeMessage']); // Liké un message
        
        // Routes pour le créateur du forum
        Route::middleware('can:update,forum')->group(function () {
            Route::put('/{forum}', [ForumController::class, 'update']); // Modifier un forum
            Route::delete('/{forum}', [ForumController::class, 'destroy']); // Supprimer un forum
        });
    });

    // Routes pour les notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']); // Lister les notifications
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']); // Nombre de notifications non lues
        Route::get('/statistics', [NotificationController::class, 'statistics']); // Statistiques des notifications
        Route::get('/{notification}', [NotificationController::class, 'show']); // Voir une notification
        Route::put('/{notification}/mark-read', [NotificationController::class, 'markAsRead']); // Marquer comme lu
        Route::put('/mark-all-read', [NotificationController::class, 'markAllAsRead']); // Tout marquer comme lu
        Route::delete('/{notification}', [NotificationController::class, 'destroy']); // Supprimer une notification
        
        // Routes pour les admins uniquement
        Route::middleware('role:admin')->group(function () {
            Route::post('/', [NotificationController::class, 'store']); // Créer des notifications
        });
    });

});
