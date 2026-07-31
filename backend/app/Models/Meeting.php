<?php

namespace App\Models;

use App\Traits\ApplyQueryScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Meeting extends Model
{
    use HasFactory, SoftDeletes, ApplyQueryScopes;

    protected $fillable = [
        'name',
        'description',
        'level_id',
        'level_section_id',
        'material_id',
        'teacher_id',
        'is_private',
        'has_free_trial',
        'total_sessions',
        'sessions_per_week',
        'status',
        'timezone',
    ];

    protected $casts = [
        'is_private' => 'boolean',
        'has_free_trial' => 'boolean',
    ];

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function levelSection()
    {
        return $this->belongsTo(LevelSection::class);
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function scopeByKeyword($query, $keyword)
    {
        if (!$keyword) {
            return $query;
        }
        return $query->where('name', 'like', "%{$keyword}%");
    }

    public function scopeByLevelId($query, $levelId)
    {
        if (!$levelId) {
            return $query;
        }
        return $query->where('level_id', $levelId);
    }

    public function scopeByMaterialId($query, $materialId)
    {
        if (!$materialId) {
            return $query;
        }
        return $query->where('material_id', $materialId);
    }

    public function scopeByStatus($query, $status)
    {
        if (!$status) {
            return $query;
        }
        return $query->where('status', $status);
    }

    public function meetingGroups()
    {
        return $this->hasMany(MeetingGroup::class);
    }

    public function meetingTimes()
    {
        return $this->hasManyThrough(MeetingTime::class, MeetingGroup::class, 'meeting_id', 'group_id');
    }
}
