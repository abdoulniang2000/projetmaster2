<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soumission extends Model
{
    use HasFactory;

    protected $fillable = ['devoir_id', 'etudiant_id', 'fichier_soumis', 'date_soumission'];

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
}
