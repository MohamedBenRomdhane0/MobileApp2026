<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChildActivity extends Model
{
    use HasFactory;

    public $timestamps = false;                 
    protected $table = 'child_activities';

    // Optional: keep action types centralized
    public const TYPE_NAVIGATION = 'navigation';
    public const TYPE_BOOK       = 'book';
    public const TYPE_COURSE     = 'course'; 
    public const TYPE_MEETING    = 'meeting';
    public const TYPE_VIDEO      = 'video';

    protected $fillable = [
        'child_id',
        'action_type',
        'screen_name',
        'reference_id',
        'duration',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'duration'   => 'integer',
    ];

    /** Optional relationships (adjust target models if different) */
    public function child()
    {
        return $this->belongsTo(User::class, 'child_id'); // if children are users
    }

    /** Handy scopes (optional) */
    public function scopeForChild($q, int $childId)   { return $q->where('child_id', $childId); }
    public function scopeSince($q, $from)            { return $q->where('created_at', '>=', $from); }
}