<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SocialAccount extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'provider', 'provider_id'];

    /**
     * The user that owns the social account.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
