<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description', 'enseignant_id'];

    public function enseignant()
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    public function devoirs()
    {
        return $this->hasMany(Devoir::class);
    }
}
