<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activite extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'description',
        'donnees',
        'user_id',
        'concernable_id',
        'concernable_type',
        'date_activite'
    ];

    protected $casts = [
        'donnees' => 'json',
        'date_activite' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function concernable()
    {
        return $this->morphTo();
    }

    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeRecentes($query, $jours = 7)
    {
        return $query->where('date_activite', '>=', now()->subDays($jours));
    }
}
