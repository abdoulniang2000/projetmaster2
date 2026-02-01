<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'type',
        'cours_id',
        'createur_id',
        'statut',
        'dernier_message_date',
        'dernier_message_contenu',
        'dernier_message_auteur',
        'nombre_messages',
        'nombre_participants',
        'visible'
    ];

    protected $casts = [
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

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_participants')
            ->withPivot(['role', 'date_adhesion', 'derniere_lecture', 'nombre_messages_non_lus', 'active', 'silencieux'])
            ->withTimestamps();
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
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

    public function scopeByCours($query, $coursId)
    {
        return $query->where('cours_id', $coursId);
    }

    public function scopeActives($query)
    {
        return $query->where('statut', 'actif');
    }

    public function scopePourUtilisateur($query, $userId)
    {
        return $query->whereHas('participants', function ($q) use ($userId) {
            $q->where('user_id', $userId)->where('active', true);
        });
    }

    public function scopeNonLues($query, $userId)
    {
        return $query->whereHas('participants', function ($q) use ($userId) {
            $q->where('user_id', $userId)
              ->where('nombre_messages_non_lus', '>', 0);
        });
    }

    public function ajouterParticipant($userId, $role = 'membre')
    {
        \Log::info('Tentative d\'ajout participant', [
            'conversation_id' => $this->id,
            'user_id' => $userId,
            'role' => $role,
            'current_participants_count' => $this->participants()->count()
        ]);
        
        if (!$this->participants()->where('user_id', $userId)->exists()) {
            try {
                $this->participants()->attach($userId, [
                    'role' => $role,
                    'date_adhesion' => now(),
                    'active' => true
                ]);
                $this->increment('nombre_participants');
                
                \Log::info('Participant ajouté avec succès', [
                    'conversation_id' => $this->id,
                    'user_id' => $userId,
                    'role' => $role,
                    'new_participants_count' => $this->fresh()->nombre_participants
                ]);
            } catch (\Exception $e) {
                \Log::error('Erreur lors de l\'ajout du participant', [
                    'conversation_id' => $this->id,
                    'user_id' => $userId,
                    'role' => $role,
                    'error' => $e->getMessage()
                ]);
                throw $e;
            }
        } else {
            \Log::warning('Participant déjà existant', [
                'conversation_id' => $this->id,
                'user_id' => $userId,
                'role' => $role
            ]);
        }
    }

    public function retirerParticipant($userId)
    {
        \Log::info('Tentative de retrait participant', [
            'conversation_id' => $this->id,
            'user_id' => $userId,
            'current_participants_count' => $this->participants()->count()
        ]);
        
        if ($this->participants()->where('user_id', $userId)->exists()) {
            try {
                $this->participants()->updateExistingPivot($userId, ['active' => false]);
                $this->decrement('nombre_participants');
                
                \Log::info('Participant retiré avec succès', [
                    'conversation_id' => $this->id,
                    'user_id' => $userId,
                    'new_participants_count' => $this->fresh()->nombre_participants
                ]);
            } catch (\Exception $e) {
                \Log::error('Erreur lors du retrait du participant', [
                    'conversation_id' => $this->id,
                    'user_id' => $userId,
                    'error' => $e->getMessage()
                ]);
                throw $e;
            }
        } else {
            \Log::warning('Participant non trouvé pour retrait', [
                'conversation_id' => $this->id,
                'user_id' => $userId
            ]);
        }
    }

    public function mettreAJourDernierMessage($contenu, $auteur)
    {
        \Log::info('Mise à jour dernier message', [
            'conversation_id' => $this->id,
            'auteur' => $auteur,
            'contenu_length' => strlen($contenu),
            'current_messages_count' => $this->nombre_messages
        ]);
        
        try {
            $this->update([
                'dernier_message_date' => now(),
                'dernier_message_contenu' => substr($contenu, 0, 100),
                'dernier_message_auteur' => $auteur
            ]);
            $this->increment('nombre_messages');
            
            \Log::info('Dernier message mis à jour avec succès', [
                'conversation_id' => $this->id,
                'new_messages_count' => $this->fresh()->nombre_messages,
                'dernier_message_auteur' => $auteur
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la mise à jour du dernier message', [
                'conversation_id' => $this->id,
                'auteur' => $auteur,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function estParticipant($userId)
    {
        return $this->participants()->where('user_id', $userId)->where('active', true)->exists();
    }

    public function getRoleUtilisateur($userId)
    {
        $participant = $this->participants()->where('user_id', $userId)->first();
        return $participant ? $participant->pivot->role : null;
    }

    public function getNombreMessagesNonLus($userId)
    {
        $participant = $this->participants()->where('user_id', $userId)->first();
        return $participant ? $participant->pivot->nombre_messages_non_lus : 0;
    }
}
