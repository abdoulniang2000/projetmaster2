<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistique extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'cle',
        'valeur',
        'metadonnees',
        'date_stat',
        'user_id',
        'cours_id'
    ];

    protected $casts = [
        'valeur' => 'integer',
        'metadonnees' => 'json',
        'date_stat' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopePeriode($query, $debut, $fin)
    {
        return $query->whereBetween('date_stat', [$debut, $fin]);
    }
}
