<?php

namespace App\Policies;

use App\Models\Devoir;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DevoirPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Devoir $devoir): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('enseignant');
    }

    public function update(User $user, Devoir $devoir): bool
    {
        return $user->hasRole('admin') || ($user->hasRole('enseignant') && $devoir->cours->enseignant_id === $user->id);
    }

    public function delete(User $user, Devoir $devoir): bool
    {
        return $user->hasRole('admin') || ($user->hasRole('enseignant') && $devoir->cours->enseignant_id === $user->id);
    }

    public function restore(User $user, Devoir $devoir): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Devoir $devoir): bool
    {
        return $user->hasRole('admin');
    }
}
