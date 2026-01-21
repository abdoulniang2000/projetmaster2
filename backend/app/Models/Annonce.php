<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Annonce extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'contenu',
        'type',
        'cours_id',
        'created_by',
        'is_active',
        'published_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'published_at' => 'datetime'
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function createur()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePublie($query)
    {
        return $query->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    public function scopeGenerale($query)
    {
        return $query->where('type', 'general');
    }

    public function scopeUrgence($query)
    {
        return $query->where('type', 'urgence');
    }

    public function scopeCours($query)
    {
        return $query->where('type', 'cours');
    }
}
