<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ['level_material_id', 'title', 'type', 'user_id'];

    protected $casts = [
        'type' => 'integer',
    ];
    /**
     * User who created the book.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    /**
     * Icon of the book.
     */
    public function icons()
    {
        return $this->hasMany(BookIcon::class);
    }
    /**
     * Level material of the book.
     */
    public function levelMaterial()
    {
        return $this->belongsTo(LevelMaterial::class);
    }
}
