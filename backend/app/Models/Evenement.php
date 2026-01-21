<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evenement extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'type',
        'date',
        'heure_debut',
        'heure_fin',
        'lieu',
        'lien',
        'cours_id',
        'instructeur_id',
        'statut',
        'rappel',
        'priorite',
        'date_creation',
        'visible'
    ];

    protected $casts = [
        'date' => 'date',
        'heure_debut' => 'datetime',
        'heure_fin' => 'datetime',
        'date_creation' => 'datetime',
        'rappel' => 'boolean',
        'visible' => 'boolean'
    ];

    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class);
    }

    public function instructeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructeur_id');
    }

    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByStatut($query, $statut)
    {
        return $query->where('statut', $statut);
    }

    public function scopeByPriorite($query, $priorite)
    {
        return $query->where('priorite', $priorite);
    }

    public function scopeByDate($query, $date)
    {
        return $query->where('date', $date);
    }

    public function scopeAVenir($query)
    {
        return $query->where('date', '>=', now());
    }

    public function scopeAujourdhui($query)
    {
        return $query->where('date', now());
    }

    public function scopeCetteSemaine($query)
    {
        return $query->whereBetween('date', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    public function getEstEnCoursAttribute(): bool
    {
        $now = now();
        $debut = $this->date->setTimeFromTimeString($this->heure_debut->format('H:i:s'));
        $fin = $this->date->setTimeFromTimeString($this->heure_fin->format('H:i:s'));

        return $now->between($debut, $fin);
    }

    public function getEstPasseAttribute(): bool
    {
        return now()->gt($this->date->setTimeFromTimeString($this->heure_fin->format('H:i:s')));
    }
}
