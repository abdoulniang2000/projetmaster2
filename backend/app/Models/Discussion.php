<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'contenu',
        'forum_id',
        'user_id',
        'is_pinned',
        'is_locked'
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_locked' => 'boolean'
    ];

    public function forum()
    {
        return $this->belongsTo(Forum::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reponses()
    {
        return $this->hasMany(Reponse::class);
    }

    public function meilleureReponse()
    {
        return $this->hasOne(Reponse::class)->where('is_best_answer', true);
    }

    public function scopeEpingle($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeVerrouille($query)
    {
        return $query->where('is_locked', true);
    }
}
