<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageTag extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id',
        'user_id',
        'tag',
        'couleur',
        'date_creation'
    ];

    protected $casts = [
        'date_creation' => 'datetime'
    ];

    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByTag($query, $tag)
    {
        return $query->where('tag', $tag);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeTagsPredefinis($query)
    {
        return $query->whereIn('tag', ['#urgent', '#annonce', '#projet', '#information', '#question', '#reunion']);
    }

    public static function getTagsPredefinis()
    {
        return [
            '#urgent' => '#ef4444',      // Rouge
            '#annonce' => '#3b82f6',    // Bleu
            '#projet' => '#22c55e',      // Vert
            '#information' => '#6b7280', // Gris
            '#question' => '#f59e0b',    // Orange
            '#reunion' => '#8b5cf6',     // Violet
            '#devoir' => '#ec4899',      // Rose
            '#examen' => '#14b8a6',      // Cyan
        ];
    }

    public static function getCouleurTag($tag)
    {
        $tags = self::getTagsPredefinis();
        return $tags[$tag] ?? '#3b82f6';
    }
}
