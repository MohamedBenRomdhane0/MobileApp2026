<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChildProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'sexe',
    ];

    /**Relation with user */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
}
