<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'titre', 'contenu', 'metadonnees', 'is_push', 'is_email', 'sent_at', 'notifiable_type', 'notifiable_id', 'read_at'];

    protected $casts = [
        'metadonnees' => 'json',
        'is_push' => 'boolean',
        'is_email' => 'boolean',
        'sent_at' => 'datetime',
        'read_at' => 'datetime'
    ];

    public function notifiable()
    {
        return $this->morphTo();
    }

    public function scopeNonLu($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeLu($query)
    {
        return $query->whereNotNull('read_at');
    }

    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopePush($query)
    {
        return $query->where('is_push', true);
    }

    public function scopeEmail($query)
    {
        return $query->where('is_email', true);
    }

    public function marquerCommeLu()
    {
        $this->update(['read_at' => now()]);
    }

    public function estLu()
    {
        return !is_null($this->read_at);
    }
}
