<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'code',
        'description',
        'departement_id',
        'credits'
    ];

    protected $casts = [
        'credits' => 'integer'
    ];

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function cours()
    {
        return $this->hasMany(Cours::class);
    }
}
