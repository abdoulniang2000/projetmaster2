<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Devoir extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'type',
        'cours_id',
        'instructeur_id',
        'date_publication',
        'date_limite',
        'ponderation',
        'instructions',
        'fichier_instructions_path',
        'visible'
    ];

    protected $casts = [
        'date_publication' => 'datetime',
        'date_limite' => 'datetime',
        'ponderation' => 'integer',
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

    public function soumissions(): HasMany
    {
        return $this->hasMany(Soumission::class);
    }

    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByCours($query, $coursId)
    {
        return $query->where('cours_id', $coursId);
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

    public function getStatutAttribute()
    {
        $now = now();
        
        if ($now < $this->date_publication) {
            return 'non_publie';
        } elseif ($now > $this->date_limite) {
            return 'expire';
        } else {
            return 'ouvert';
        }
    }
}
