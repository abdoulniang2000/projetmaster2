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
        'enseignant_id',
        'date_publication',
        'date_expiration',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean',
        'date_publication' => 'datetime',
        'date_expiration' => 'datetime'
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function enseignant()
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopePublie($query)
    {
        return $query->whereNotNull('date_publication')
                    ->where('date_publication', '<=', now());
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
