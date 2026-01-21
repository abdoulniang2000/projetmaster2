<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Soumission extends Model
{
    use HasFactory;

    protected $fillable = [
        'devoir_id',
        'etudiant_id',
        'fichier_path',
        'fichier_nom',
        'fichier_taille',
        'commentaire',
        'version',
        'statut',
        'note',
        'feedback',
        'date_soumission',
        'date_correction',
        'correcteur_id'
    ];

    protected $casts = [
        'version' => 'integer',
        'note' => 'decimal:2',
        'date_soumission' => 'datetime',
        'date_correction' => 'datetime'
    ];

    public function devoir(): BelongsTo
    {
        return $this->belongsTo(Devoir::class);
    }

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'etudiant_id');
    }

    public function correcteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'correcteur_id');
    }

    public function scopeByEtudiant($query, $etudiantId)
    {
        return $query->where('etudiant_id', $etudiantId);
    }

    public function scopeByDevoir($query, $devoirId)
    {
        return $query->where('devoir_id', $devoirId);
    }

    public function scopeByStatut($query, $statut)
    {
        return $query->where('statut', $statut);
    }

    public function scopeDerniereVersion($query)
    {
        return $query->orderBy('version', 'desc');
    }

    public function scopeCorrigees($query)
    {
        return $query->where('statut', 'corrige');
    }

    public function scopeEnAttente($query)
    {
        return $query->where('statut', 'en_attente');
    }

    protected static function booted()
    {
        static::creating(function ($soumission) {
            $derniereVersion = static::where('devoir_id', $soumission->devoir_id)
                                    ->where('etudiant_id', $soumission->etudiant_id)
                                    ->max('version');
            $soumission->version = ($derniereVersion ?? 0) + 1;
        });
    }
}
