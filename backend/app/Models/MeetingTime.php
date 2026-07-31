<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Media;

class MeetingTime extends Model
{
    use HasFactory, SoftDeletes;
    protected $appends = ['has_supports'];

    protected $fillable = [
        'group_id',
        'meeting_date',
        'start_time',
        'end_time',
        'duration',
        'day_of_week',
        'occurrence_in_day',
        'status',
        'reschedule_details',
        'cancellation_reason',
        'cancellation_comment',
    ];

    protected $casts = [
        'reschedule_details' => 'array',
        'meeting_date'       => 'date',
    ];

    public function getHasSupportsAttribute(): bool
    {
        if ($this->relationLoaded('media')) {
            return $this->media->isNotEmpty();
        }

        return $this->media()->exists();
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }

    public function group()
    {
        return $this->belongsTo(MeetingGroup::class, 'group_id');
    }

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }
}
