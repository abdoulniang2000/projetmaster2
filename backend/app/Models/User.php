<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
        'phone',
        'address',
        'city',
        'country',
        'postal_code',
        'department',
        'student_id',
        'about',
        'avatar',
        'status',
        'role',
        'last_login_at',
        'last_login_ip',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
        'last_login_ip',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'status' => 'boolean',
        ];
    }

    /**
     * Get the user's full name.
     *
     * @return string
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the user's avatar URL.
     *
     * @return string|null
     */
    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : null;
    }

    /**
     * Get the roles that belong to the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    /**
     * Check if the user has a specific role.
     *
     * @param string $role
     * @return bool
     */
    public function hasRole(string $role): bool
    {
        return $this->roles()->where('name', $role)->exists();
    }

    /**
     * Check if the user has any of the given roles.
     *
     * @param array $roles
     * @return bool
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('name', $roles)->exists();
    }

    public function coursEnseignes()
    {
        return $this->hasMany(Cours::class, 'enseignant_id');
    }

    public function soumissions()
    {
        return $this->hasMany(Soumission::class, 'etudiant_id');
    }

    public function notesDonnees()
    {
        return $this->hasMany(Note::class, 'evaluateur_id');
    }

    public function notes()
    {
        return $this->hasManyThrough(
            Note::class,
            Soumission::class,
            'etudiant_id',
            'soumission_id',
            'id',
            'id'
        );
    }

    public function messagesEnvoyes()
    {
        return $this->hasMany(Message::class, 'expediteur_id');
    }

    public function messagesRecus()
    {
        return $this->hasMany(Message::class, 'destinataire_id');
    }

    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }

    public function fichiers()
    {
        return $this->hasMany(Fichier::class, 'uploaded_by');
    }

    public function forums()
    {
        return $this->hasMany(Forum::class, 'created_by');
    }

    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }

    public function reponses()
    {
        return $this->hasMany(Reponse::class);
    }

    public function annonces()
    {
        return $this->hasMany(Annonce::class, 'created_by');
    }

    public function statistiques()
    {
        return $this->hasMany(Statistique::class);
    }

    public function activites()
    {
        return $this->hasMany(Activite::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class, 'department');
    }

    public function coursInscrits()
    {
        return $this->belongsToMany(Cours::class, 'cours_etudiants')
                    ->withTimestamps();
    }

    public function messagesNonLus()
    {
        return $this->messagesRecus()->nonLu();
    }

    public function notificationsNonLues()
    {
        return $this->notifications()->nonLu();
    }

    public function estEtudiant()
    {
        return $this->hasRole('etudiant');
    }

    public function estEnseignant()
    {
        return $this->hasRole('enseignant');
    }

    public function estAdmin()
    {
        return $this->hasRole('admin');
    }
}
