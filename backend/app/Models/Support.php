<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Support extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'type',
        'fichier_path',
        'fichier_nom',
        'fichier_taille',
        'cours_id',
        'instructeur_id',
        'date_ajout',
        'nombre_telechargements',
        'categorie',
        'visible'
    ];

    protected $casts = [
        'date_ajout' => 'datetime',
        'visible' => 'boolean',
        'nombre_telechargements' => 'integer'
    ];

    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class);
    }

    public function instructeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructeur_id');
    }

    public function incrementerTelechargements(): void
    {
        $this->increment('nombre_telechargements');
    }

    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByCategorie($query, $categorie)
    {
        return $query->where('categorie', $categorie);
    }

    public function scopeByCours($query, $coursId)
    {
        return $query->where('cours_id', $coursId);
    }
}
