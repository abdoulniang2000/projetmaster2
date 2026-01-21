<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'forum_id',
        'auteur_id',
        'contenu',
        'parent_id',
        'nombre_likes',
        'date_creation',
        'visible'
    ];

    protected $casts = [
        'date_creation' => 'datetime',
        'nombre_likes' => 'integer',
        'visible' => 'boolean'
    ];

    public function forum(): BelongsTo
    {
        return $this->belongsTo(Forum::class);
    }

    public function auteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'auteur_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ForumMessage::class, 'parent_id');
    }

    public function reponses(): HasMany
    {
        return $this->hasMany(ForumMessage::class, 'parent_id');
    }

    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }

    public function scopeByForum($query, $forumId)
    {
        return $query->where('forum_id', $forumId);
    }

    public function scopeRacines($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeReponses($query, $parentId)
    {
        return $query->where('parent_id', $parentId);
    }

    public function incrementerLikes(): void
    {
        $this->increment('nombre_likes');
    }

    protected static function booted()
    {
        static::created(function ($message) {
            $message->forum->incrementerMessages();
            $message->forum->mettreAJourDernierMessage(
                $message->auteur->name,
                substr($message->contenu, 0, 100)
            );
        });
    }
}
