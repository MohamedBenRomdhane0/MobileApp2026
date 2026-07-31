<?php

namespace App\Models;

use App\Traits\ApplyQueryScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MeetingGroup extends Model
{
    use HasFactory, ApplyQueryScopes, SoftDeletes;

    protected $fillable = [
        'meeting_id',
        'name',
        'max_students',
        'unit_price',
        'net_price',
        'start_date',
        'end_date',
        'preset',
        'sessions_per_week',
        'sessions_per_day',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'net_price'  => 'decimal:2',
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function meetingTimes()
    {
        return $this->hasMany(MeetingTime::class, 'group_id');
    }

    public function promos()
    {
        return $this->hasMany(MeetingGroupPromo::class, 'meeting_group_id');
    }
}
