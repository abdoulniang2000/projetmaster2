<?php

namespace App\Policies;

use App\Models\Soumission;
use App\Models\User;
use App\Models\Devoir;
use Illuminate\Auth\Access\HandlesAuthorization;

class SoumissionPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, Devoir $devoir): bool
    {
        return $user->hasRole('admin') || ($user->hasRole('enseignant') && $devoir->cours->enseignant_id === $user->id);
    }

    public function view(User $user, Soumission $soumission): bool
    {
        return $user->hasRole('admin') 
            || ($user->hasRole('enseignant') && $soumission->devoir->cours->enseignant_id === $user->id)
            || $soumission->etudiant_id === $user->id;
    }

    public function create(User $user, Devoir $devoir): bool
    {
        // Seuls les étudiants peuvent soumettre, et une seule fois par devoir.
        return $user->hasRole('etudiant') && !$devoir->soumissions()->where('etudiant_id', $user->id)->exists();
    }

    public function delete(User $user, Soumission $soumission): bool
    {
        return $user->hasRole('admin') || ($user->hasRole('enseignant') && $soumission->devoir->cours->enseignant_id === $user->id);
    }
}
