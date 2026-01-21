<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Forum extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'cours_id',
        'created_by',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function createur()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }

    public function scopeActif($query)
    {
        return $query->where('is_active', true);
    }
}
