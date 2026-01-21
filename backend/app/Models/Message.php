<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['expediteur_id', 'destinataire_id', 'contenu', 'sujet', 'tags', 'is_urgent', 'is_read', 'read_at', 'groupe_id'];

    protected $casts = [
        'tags' => 'json',
        'is_urgent' => 'boolean',
        'is_read' => 'boolean',
        'read_at' => 'datetime'
    ];

    public function expediteur()
    {
        return $this->belongsTo(User::class, 'expediteur_id');
    }

    public function destinataire()
    {
        return $this->belongsTo(User::class, 'destinataire_id');
    }

    public function groupe()
    {
        return $this->belongsTo(Cours::class, 'groupe_id');
    }

    public function fichiers()
    {
        return $this->morphMany(Fichier::class, 'fichierable');
    }

    public function scopeNonLu($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeUrgent($query)
    {
        return $query->where('is_urgent', true);
    }

    public function scopeParTag($query, $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }

    public function marquerCommeLu()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }

    public function addTag($tag)
    {
        $tags = $this->tags ?? [];
        if (!in_array($tag, $tags)) {
            $tags[] = $tag;
            $this->update(['tags' => $tags]);
        }
    }
}
