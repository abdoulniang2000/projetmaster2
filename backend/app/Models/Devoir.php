<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Devoir extends Model
{
    use HasFactory;

    protected $fillable = ['cours_id', 'titre', 'description', 'date_limite', 'fichier_joint', 'note_maximale', 'is_published', 'allow_late_submission', 'instructions'];

    protected $casts = [
        'date_limite' => 'datetime',
        'note_maximale' => 'integer',
        'is_published' => 'boolean',
        'allow_late_submission' => 'boolean'
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function soumissions()
    {
        return $this->hasMany(Soumission::class);
    }

    public function fichiers()
    {
        return $this->morphMany(Fichier::class, 'fichierable');
    }

    public function notes()
    {
        return $this->hasManyThrough(Note::class, Soumission::class);
    }

    public function scopePublie($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeNonExpire($query)
    {
        return $query->where('date_limite', '>', now());
    }

    public function getTauxRemiseAttribute()
    {
        $totalEtudiants = $this->cours->etudiantsInscrits()->count();
        if ($totalEtudiants === 0) return 0;
        
        $nbSoumissions = $this->soumissions()->count();
        return round(($nbSoumissions / $totalEtudiants) * 100, 2);
    }
}
