<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaLike extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'likeable_id', 'likeable_type'];
    /**
     * Morph relation with likeable
     */
    public function likeable()
    {
        return $this->morphTo();
    }
    /**
     * Relation with user
     */

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
