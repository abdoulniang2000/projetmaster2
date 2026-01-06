<?php

namespace App\Policies;

use App\Models\Cours;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CoursPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Cours $cours): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('enseignant');
    }

    public function update(User $user, Cours $cours): bool
    {
        return $user->hasRole('admin') || ($user->hasRole('enseignant') && $cours->enseignant_id === $user->id);
    }

    public function delete(User $user, Cours $cours): bool
    {
        return $user->hasRole('admin') || ($user->hasRole('enseignant') && $cours->enseignant_id === $user->id);
    }

    public function restore(User $user, Cours $cours): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Cours $cours): bool
    {
        return $user->hasRole('admin');
    }
}
