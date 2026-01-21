<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'expediteur_id',
        'contenu',
        'type',
        'fichier_path',
        'fichier_nom',
        'fichier_taille',
        'lien_url',
        'lien_titre',
        'est_edite',
        'date_edition',
        'est_supprime',
        'date_suppression',
        'date_envoi',
        'visible'
    ];

    protected $casts = [
        'date_edition' => 'datetime',
        'date_suppression' => 'datetime',
        'date_envoi' => 'datetime',
        'est_edite' => 'boolean',
        'est_supprime' => 'boolean',
        'visible' => 'boolean'
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function expediteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'expediteur_id');
    }

    public function tags(): HasMany
    {
        return $this->hasMany(MessageTag::class);
    }

    public function scopeVisible($query)
    {
        return $query->where('visible', true)->where('est_supprime', false);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByConversation($query, $conversationId)
    {
        return $query->where('conversation_id', $conversationId);
    }

    public function scopeChronologique($query)
    {
        return $query->orderBy('date_envoi', 'asc');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('date_envoi', 'desc');
    }

    public function editer($nouveauContenu)
    {
        $this->update([
            'contenu' => $nouveauContenu,
            'est_edite' => true,
            'date_edition' => now()
        ]);
    }

    public function supprimer()
    {
        $this->update([
            'est_supprime' => true,
            'date_suppression' => now(),
            'visible' => false
        ]);
    }

    public function ajouterTag($tag, $userId, $couleur = '#3b82f6')
    {
        $this->tags()->create([
            'user_id' => $userId,
            'tag' => $tag,
            'couleur' => $couleur,
            'date_creation' => now()
        ]);
    }

    public function getTagsListe()
    {
        return $this->tags()->pluck('tag')->toArray();
    }

    public function aDesTags()
    {
        return $this->tags()->exists();
    }

    protected static function booted()
    {
        static::created(function ($message) {
            // Mettre à jour la conversation
            $message->conversation->mettreAJourDernierMessage(
                $message->contenu,
                $message->expediteur->name
            );

            // Marquer les messages comme non lus pour les autres participants
            $message->conversation->participants()
                ->where('user_id', '!=', $message->expediteur_id)
                ->where('active', true)
                ->increment('nombre_messages_non_lus');
        });
    }
}
