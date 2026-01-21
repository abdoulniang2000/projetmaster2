<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'contenu',
        'discussion_id',
        'user_id',
        'is_best_answer'
    ];

    protected $casts = [
        'is_best_answer' => 'boolean'
    ];

    public function discussion()
    {
        return $this->belongsTo(Discussion::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeMeilleureReponse($query)
    {
        return $query->where('is_best_answer', true);
    }
}
