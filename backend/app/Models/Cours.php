<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description', 'enseignant_id', 'module_id', 'matiere_id', 'semestre_id', 'code', 'credits', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'credits' => 'integer'
    ];

    public function enseignant()
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    public function semestre()
    {
        return $this->belongsTo(Semestre::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function devoirs()
    {
        return $this->hasMany(Devoir::class);
    }

    public function fichiers()
    {
        return $this->morphMany(Fichier::class, 'fichierable');
    }

    public function forums()
    {
        return $this->hasMany(Forum::class);
    }

    public function annonces()
    {
        return $this->hasMany(Annonce::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'groupe_id');
    }

    public function statistiques()
    {
        return $this->hasMany(Statistique::class);
    }

    public function activites()
    {
        return $this->morphMany(Activite::class, 'concernable');
    }

    public function etudiantsInscrits()
    {
        return $this->belongsToMany(User::class, 'cours_etudiants')
                    ->withTimestamps();
    }

    public function scopeActif($query)
    {
        return $query->where('is_active', true);
    }
}
