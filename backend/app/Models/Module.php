<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'cours_id', 'titre', 'contenu', 'ordre'];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }
}
