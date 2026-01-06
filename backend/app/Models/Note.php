<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $fillable = ['soumission_id', 'evaluateur_id', 'note', 'commentaire'];

    public function soumission()
    {
        return $this->belongsTo(Soumission::class);
    }

    public function evaluateur()
    {
        return $this->belongsTo(User::class, 'evaluateur_id');
    }
}
