<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Forum extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'cours_id',
        'createur_id',
        'categorie',
        'statut',
        'nombre_messages',
        'nombre_participants',
        'date_creation',
        'dernier_message_date',
        'dernier_message_auteur',
        'dernier_message_contenu',
        'visible'
    ];

    protected $casts = [
        'date_creation' => 'datetime',
        'dernier_message_date' => 'datetime',
        'nombre_messages' => 'integer',
        'nombre_participants' => 'integer',
        'visible' => 'boolean'
    ];

    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class);
    }

    public function createur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'createur_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ForumMessage::class);
    }

    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }

    public function scopeByCategorie($query, $categorie)
    {
        return $query->where('categorie', $categorie);
    }

    public function scopeByStatut($query, $statut)
    {
        return $query->where('statut', $statut);
    }

    public function scopeByCours($query, $coursId)
    {
        return $query->where('cours_id', $coursId);
    }

    public function incrementerMessages(): void
    {
        $this->increment('nombre_messages');
    }

    public function mettreAJourDernierMessage($auteur, $contenu): void
    {
        $this->update([
            'dernier_message_date' => now(),
            'dernier_message_auteur' => $auteur,
            'dernier_message_contenu' => $contenu
        ]);
    }
}
