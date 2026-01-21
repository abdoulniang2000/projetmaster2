<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fichier extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'chemin',
        'type',
        'taille',
        'fichierable_id',
        'fichierable_type',
        'uploaded_by'
    ];

    protected $casts = [
        'taille' => 'integer'
    ];

    public function fichierable()
    {
        return $this->morphTo();
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getUrlAttribute()
    {
        return asset('storage/' . $this->chemin);
    }

    public function getExtensionAttribute()
    {
        return pathinfo($this->nom, PATHINFO_EXTENSION);
    }

    public function isImage()
    {
        return in_array(strtolower($this->extension), ['jpg', 'jpeg', 'png', 'gif', 'webp']);
    }

    public function isPdf()
    {
        return strtolower($this->extension) === 'pdf';
    }

    public function isVideo()
    {
        return in_array(strtolower($this->extension), ['mp4', 'avi', 'mov', 'wmv', 'flv']);
    }
}
