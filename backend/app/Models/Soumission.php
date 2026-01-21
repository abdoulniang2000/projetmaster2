<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soumission extends Model
{
    use HasFactory;

    protected $fillable = ['devoir_id', 'etudiant_id', 'fichier', 'version', 'commentaire', 'is_late', 'date_soumission'];

    protected $casts = [
        'version' => 'integer',
        'is_late' => 'boolean',
        'date_soumission' => 'datetime'
    ];

    public function devoir()
    {
        return $this->belongsTo(Devoir::class);
    }

    public function etudiant()
    {
        return $this->belongsTo(User::class, 'etudiant_id');
    }

    public function note()
    {
        return $this->hasOne(Note::class);
    }

    public function fichiers()
    {
        return $this->morphMany(Fichier::class, 'fichierable');
    }

    public function activites()
    {
        return $this->morphMany(Activite::class, 'concernable');
    }

    public function scopeEnRetard($query)
    {
        return $query->where('is_late', true);
    }

    public function scopeDerniereVersion($query)
    {
        return $query->orderBy('version', 'desc');
    }

    protected static function booted()
    {
        static::creating(function ($soumission) {
            $derniereVersion = static::where('devoir_id', $soumission->devoir_id)
                                    ->where('etudiant_id', $soumission->etudiant_id)
                                    ->max('version');
            $soumission->version = ($derniereVersion ?? 0) + 1;
            
            $soumission->is_late = $soumission->devoir->date_limite < now();
        });
    }
}
