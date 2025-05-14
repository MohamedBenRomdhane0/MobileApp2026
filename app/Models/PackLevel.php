<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PackLevel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'pack_id',
        'level_id',
        'price',
        'access_month',
        'start_date',
        'end_date',
        'discount',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'access_month' => 'integer',
        'status' => 'integer',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];
    /**
     * The pack that owns the level.
     */
    public function pack()
    {
        return $this->belongsTo(Pack::class);
    }
    /**
     * The level that owns the pack.
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }
}
