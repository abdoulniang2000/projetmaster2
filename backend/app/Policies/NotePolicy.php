<?php

namespace App\Policies;

use App\Models\Note;
use App\Models\Soumission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NotePolicy
{
    use HandlesAuthorization;

    public function view(User $user, Note $note): bool
    {
        return $user->hasRole('admin')
            || ($user->hasRole('enseignant') && $note->soumission->devoir->cours->enseignant_id === $user->id)
            || $note->soumission->etudiant_id === $user->id;
    }

    public function create(User $user, Soumission $soumission): bool
    {
        // Ne peut noter qu'une seule fois
        if ($soumission->note) {
            return false;
        }
        return $user->hasRole('admin') || ($user->hasRole('enseignant') && $soumission->devoir->cours->enseignant_id === $user->id);
    }

    public function update(User $user, Note $note): bool
    {
        return $user->hasRole('admin') || ($user->hasRole('enseignant') && $note->soumission->devoir->cours->enseignant_id === $user->id);
    }

    public function delete(User $user, Note $note): bool
    {
        return $user->hasRole('admin') || ($user->hasRole('enseignant') && $note->soumission->devoir->cours->enseignant_id === $user->id);
    }
}
