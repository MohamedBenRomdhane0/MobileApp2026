<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserSession extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['user_id', 'device_type', 'last_login_at', 'online_time'];

    protected $casts = [
        'device_type' => 'integer',
        'last_login_at' => 'datetime',
        'online_time' => 'integer',
    ];

    /**
     * Relation with user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
