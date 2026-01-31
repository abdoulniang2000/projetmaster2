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
        'module_id',
        'semestre_id',
        'credits'
    ];

    protected $casts = [
        'credits' => 'integer'
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function semestre()
    {
        return $this->belongsTo(Semestre::class);
    }

    public function cours()
    {
        return $this->hasMany(Cours::class);
    }
}
