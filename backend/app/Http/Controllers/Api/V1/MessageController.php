<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreMessageRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $messages = Message::where('expediteur_id', $userId)
                            ->orWhere('destinataire_id', $userId)
                            ->with(['expediteur', 'destinataire'])
                            ->latest()
                            ->get();

        // Grouper les messages par conversation (avec l'autre utilisateur)
        $conversations = $messages->groupBy(function ($message) use ($userId) {
            return $message->expediteur_id === $userId ? $message->destinataire_id : $message->expediteur_id;
        });

        return response()->json($conversations);
    }

    public function show(User $user, Request $request)
    {
        $authUserId = $request->user()->id;
        $otherUserId = $user->id;

        $messages = Message::where(function ($query) use ($authUserId, $otherUserId) {
            $query->where('expediteur_id', $authUserId)->where('destinataire_id', $otherUserId);
        })->orWhere(function ($query) use ($authUserId, $otherUserId) {
            $query->where('expediteur_id', $otherUserId)->where('destinataire_id', $authUserId);
        })
        ->with(['expediteur', 'destinataire'])
        ->orderBy('created_at', 'asc')
        ->get();

        // Marquer les messages comme lus
        Message::where('expediteur_id', $otherUserId)
               ->where('destinataire_id', $authUserId)
               ->whereNull('lu_at')
               ->update(['lu_at' => now()]);

        return response()->json($messages);
    }

    public function store(StoreMessageRequest $request)
    {
        $message = Message::create([
            'expediteur_id' => $request->user()->id,
            'destinataire_id' => $request->destinataire_id,
            'contenu' => $request->contenu,
        ]);

        return response()->json($message, 201);
    }
}
