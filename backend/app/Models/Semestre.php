<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semestre extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'date_debut',
        'date_fin',
        'is_active'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'is_active' => 'boolean'
    ];

    public function cours()
    {
        return $this->hasMany(Cours::class);
    }

    public function scopeActif($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeCourant($query)
    {
        return $query->where('date_debut', '<=', now())
                    ->where('date_fin', '>=', now());
    }
}
