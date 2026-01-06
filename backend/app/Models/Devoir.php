<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Devoir extends Model
{
    use HasFactory;

    protected $fillable = ['cours_id', 'titre', 'description', 'date_limite', 'fichier_joint'];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function soumissions()
    {
        return $this->hasMany(Soumission::class);
    }
}
