<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MessagePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Message $message): bool
    {
        return $message->expediteur_id === $user->id || $message->destinataire_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }
}
