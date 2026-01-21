<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'code',
        'chef_id'
    ];

    public function chef()
    {
        return $this->belongsTo(User::class, 'chef_id');
    }

    public function matieres()
    {
        return $this->hasMany(Matiere::class);
    }

    public function users()
    {
        return $this->hasMany(User::class, 'department');
    }
}
