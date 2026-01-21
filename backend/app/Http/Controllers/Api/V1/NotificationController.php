<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = $user->notifications()->latest();

        // Filtres
        if ($request->has('type')) {
            $query->type($request->type);
        }

        if ($request->has('non_lu')) {
            $query->nonLu();
        }

        if ($request->has('push')) {
            $query->push();
        }

        if ($request->has('email')) {
            $query->email();
        }

        $notifications = $query->paginate($request->get('per_page', 15));

        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|max:50',
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'notifiable_type' => 'required|string',
            'notifiable_id' => 'required|integer',
            'metadonnees' => 'nullable|array',
            'is_push' => 'boolean',
            'is_email' => 'boolean'
        ]);

        $notification = Notification::create([
            'type' => $request->type,
            'titre' => $request->titre,
            'contenu' => $request->contenu,
            'notifiable_type' => $request->notifiable_type,
            'notifiable_id' => $request->notifiable_id,
            'metadonnees' => $request->metadonnees ?? [],
            'is_push' => $request->is_push ?? false,
            'is_email' => $request->is_email ?? false
        ]);

        return response()->json($notification, 201);
    }

    public function show(Notification $notification)
    {
        $user = Auth::user();
        
        // Vérifier que la notification appartient à l'utilisateur
        if ($notification->notifiable_type === \App\Models\User::class && 
            $notification->notifiable_id !== $user->id && 
            !$user->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        return response()->json($notification);
    }

    public function markAsRead(Request $request, $notificationId)
    {
        $notification = $request->user()->notifications()->findOrFail($notificationId);
        $notification->marquerCommeLu();

        return response()->json(['message' => 'Notification marked as read.']);
    }

    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();
        
        $user->notifications()->nonLu()->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    public function destroy(Notification $notification)
    {
        $user = Auth::user();
        
        // Vérifier que la notification appartient à l'utilisateur
        if ($notification->notifiable_type === \App\Models\User::class && 
            $notification->notifiable_id !== $user->id && 
            !$user->estAdmin()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $notification->delete();

        return response()->json(null, 204);
    }

    public function getUnreadCount()
    {
        $user = Auth::user();
        $count = $user->notifications()->nonLu()->count();

        return response()->json(['count' => $count]);
    }

    // Notifications push
    public function sendPushNotification(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'destinataires' => 'required|array',
            'destinataires.*' => 'integer|exists:users,id',
            'metadonnees' => 'nullable|array'
        ]);

        $notifications = [];
        
        foreach ($request->destinataires as $destinataireId) {
            $notification = Notification::create([
                'type' => 'push',
                'titre' => $request->titre,
                'contenu' => $request->contenu,
                'notifiable_type' => \App\Models\User::class,
                'notifiable_id' => $destinataireId,
                'metadonnees' => $request->metadonnees ?? [],
                'is_push' => true,
                'sent_at' => now()
            ]);
            
            $notifications[] = $notification;
        }

        // TODO: Intégrer avec un service de push notifications (Firebase, etc.)

        return response()->json([
            'message' => 'Notifications push envoyées',
            'notifications' => $notifications
        ], 201);
    }

    // Notifications par email
    public function sendEmailNotification(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'destinataires' => 'required|array',
            'destinataires.*' => 'integer|exists:users,id',
            'metadonnees' => 'nullable|array'
        ]);

        $notifications = [];
        
        foreach ($request->destinataires as $destinataireId) {
            $user = \App\Models\User::find($destinataireId);
            
            if ($user && $user->email) {
                $notification = Notification::create([
                    'type' => 'email',
                    'titre' => $request->titre,
                    'contenu' => $request->contenu,
                    'notifiable_type' => \App\Models\User::class,
                    'notifiable_id' => $destinataireId,
                    'metadonnees' => $request->metadonnees ?? [],
                    'is_email' => true,
                    'sent_at' => now()
                ]);
                
                // TODO: Envoyer l'email réel
                // Mail::to($user->email)->send(new NotificationEmail($request->titre, $request->contenu));
                
                $notifications[] = $notification;
            }
        }

        return response()->json([
            'message' => 'Notifications email envoyées',
            'notifications' => $notifications
        ], 201);
    }

    // Notifications automatiques
    public function createDevoirNotification($devoirId)
    {
        $devoir = \App\Models\Devoir::with('cours.etudiantsInscrits')->findOrFail($devoirId);
        
        foreach ($devoir->cours->etudiantsInscrits as $etudiant) {
            Notification::create([
                'type' => 'devoir_publie',
                'titre' => 'Nouveau devoir publié',
                'contenu' => "Un nouveau devoir '{$devoir->titre}' a été publié dans {$devoir->cours->nom}",
                'notifiable_type' => \App\Models\User::class,
                'notifiable_id' => $etudiant->id,
                'metadonnees' => [
                    'devoir_id' => $devoir->id,
                    'cours_id' => $devoir->cours->id,
                    'date_limite' => $devoir->date_limite
                ],
                'is_push' => true,
                'is_email' => true
            ]);
        }
    }

    public function createNoteNotification($noteId)
    {
        $note = \App\Models\Note::with('soumission.etudiant', 'soumission.devoir.cours')->findOrFail($noteId);
        
        Notification::create([
            'type' => 'note_publiee',
            'titre' => 'Note publiée',
            'contenu' => "Votre note pour le devoir '{$note->soumission->devoir->titre}' a été publiée",
            'notifiable_type' => \App\Models\User::class,
            'notifiable_id' => $note->soumission->etudiant_id,
            'metadonnees' => [
                'note_id' => $note->id,
                'devoir_id' => $note->soumission->devoir->id,
                'valeur' => $note->valeur
            ],
            'is_push' => true,
            'is_email' => true
        ]);
    }

    public function createDeadlineNotification()
    {
        // Notifications pour les devoirs dont la date limite approche
        $devoirsProches = \App\Models\Devoir::where('date_limite', '<=', now()->addDays(2))
                                          ->where('date_limite', '>', now())
                                          ->where('is_published', true)
                                          ->with('cours.etudiantsInscrits')
                                          ->get();

        foreach ($devoirsProches as $devoir) {
            foreach ($devoir->cours->etudiantsInscrits as $etudiant) {
                // Vérifier si l'étudiant n'a pas déjà soumis
                $aSoumis = \App\Models\Soumission::where('devoir_id', $devoir->id)
                                                ->where('etudiant_id', $etudiant->id)
                                                ->exists();
                
                if (!$aSoumis) {
                    Notification::create([
                        'type' => 'deadline_approche',
                        'titre' => 'Date limite proche',
                        'contenu' => "Le devoir '{$devoir->titre}' doit être rendu avant le {$devoir->date_limite->format('d/m/Y H:i')}",
                        'notifiable_type' => \App\Models\User::class,
                        'notifiable_id' => $etudiant->id,
                        'metadonnees' => [
                            'devoir_id' => $devoir->id,
                            'cours_id' => $devoir->cours->id,
                            'date_limite' => $devoir->date_limite
                        ],
                        'is_push' => true,
                        'is_email' => false
                    ]);
                }
            }
        }
    }
}
