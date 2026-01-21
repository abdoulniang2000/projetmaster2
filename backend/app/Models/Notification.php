<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'message',
        'type',
        'categorie',
        'user_id',
        'lue',
        'priorite',
        'action_url',
        'action_label',
        'date_creation',
        'expire_le',
        'visible'
    ];

    protected $casts = [
        'date_creation' => 'datetime',
        'expire_le' => 'datetime',
        'lue' => 'boolean',
        'visible' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }

    public function scopeNonExpire($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expire_le')
              ->orWhere('expire_le', '>', now());
        });
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByCategorie($query, $categorie)
    {
        return $query->where('categorie', $categorie);
    }

    public function scopeByPriorite($query, $priorite)
    {
        return $query->where('priorite', $priorite);
    }

    public function scopeNonLues($query)
    {
        return $query->where('lue', false);
    }

    public function scopeLues($query)
    {
        return $query->where('lue', true);
    }

    public function marquerCommeLue(): void
    {
        $this->update(['lue' => true]);
    }

    public function estExpiree(): bool
    {
        return $this->expire_le && now()->gt($this->expire_le);
    }
}
