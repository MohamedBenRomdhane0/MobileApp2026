<?php

namespace App\Models;

use App\Enum\RoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use App\Models\TeacherProfile;
use App\Models\ParentProfile;
use App\Models\ChildProfile;
use App\Models\UserSession;
use App\Models\SocialAccount;
use App\Models\Book;
use App\Models\Media;
use App\Models\Course;
use App\Models\MediaLike;
use App\Models\TeacherLevelMaterial;
use App\Models\TeacherLevelSectionMaterial;
use App\Models\LevelMaterial;
use App\Models\LevelSectionMaterial;
use App\Models\Review;
use App\Traits\ApplyQueryScopes;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;
    use ApplyQueryScopes;

    protected $fillable = ['full_name', 'email', 'phone', 'password', 'status', 'email_verified_at', 'last_seen_at'];

    protected $hidden = ['password', 'remember_token', 'email_verified_at', 'updated_at', 'deleted_at'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_seen_at' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

    public function teacherProfile()
    {
        return $this->hasOne(TeacherProfile::class);
    }

    public function parentProfile()
    {
        return $this->hasOne(ParentProfile::class);
    }

    public function childProfile()
    {
        return $this->hasOne(ChildProfile::class);
    }

    public function sessions()
    {
        return $this->hasMany(UserSession::class);
    }

    public function socialAccounts()
    {
        return $this->hasMany(SocialAccount::class);
    }

    public function books()
    {
        return $this->hasMany(Book::class);
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }

    public function mediaLikes()
    {
        return $this->hasMany(MediaLike::class);
    }

public function favoriteCourses(): MorphToMany
{
    return $this->morphedByMany(
        Course::class,
        'likeable',
        'media_likes',
        'user_id',
        'likeable_id'
    )->withTimestamps();
}


    public function teacherLevelMaterials()
    {
        return $this->hasMany(TeacherLevelMaterial::class, 'teacher_id');
    }

    public function levelMaterials()
    {
        return $this->belongsToMany(LevelMaterial::class, 'teacher_level_materials', 'teacher_id', 'level_material_id')
            ->withTimestamps();
    }

    public function teacherLevelSectionMaterials()
    {
        return $this->hasMany(TeacherLevelSectionMaterial::class, 'teacher_id');
    }

    public function levelSectionMaterials()
    {
        return $this->belongsToMany(LevelSectionMaterial::class, 'teacher_level_section_materials', 'teacher_id', 'level_section_material_id')
            ->withTimestamps();
    }

    public function getProfileAttribute()
    {
        if ($this->hasRole(RoleEnum::TEACHER->value)) {
            return $this->teacherProfile;
        }

        if ($this->hasRole(RoleEnum::PARENT->value)) {
            return $this->parentProfile;
        }

        if ($this->hasRole(RoleEnum::CHILD->value)) {
            return $this->childProfile;
        }

        return null;
    }

    public function getProfileTypeAttribute(): ?string
    {
        if ($this->hasRole(RoleEnum::TEACHER->value)) {
            return RoleEnum::TEACHER->value;
        }
        if ($this->hasRole(RoleEnum::PARENT->value)) {
            return RoleEnum::PARENT->value;
        }
        if ($this->hasRole(RoleEnum::CHILD->value)) {
            return RoleEnum::CHILD->value;
        }

        return null;
    }

  public function followers()
{
    return $this->belongsToMany(User::class, 'teacher_followers', 'teacher_id', 'child_id')
        ->withPivot('followed_at');
}

public function followedTeachers()
{
    return $this->belongsToMany(User::class, 'teacher_followers', 'child_id', 'teacher_id')
        ->withPivot('followed_at');
}

    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'teacher_id');
    }

    public function reviewsWritten()
    {
        return $this->hasMany(Review::class, 'child_id');
    }

    public function getRoleAttribute()
    {
        return $this->getRoleNames();
    }

    public function getAllPermissionsAttribute()
    {
        return $this->getAllPermissions()->pluck('name');
    }

    public function scopeByRole($query, $role)
    {
        return $query->whereHas('roles', function ($q) use ($role) {
            $q->where('name', $role);
        });
    }

    public function scopeByRolesNotIn($query, $roles)
    {
        return $query->whereDoesntHave('roles', function ($q) use ($roles) {
            $q->whereIn('name', $roles);
        });
    }

    public function scopeByKeyword($query, ?string $keyword)
    {
        if (!empty($keyword)) {
            $query->where(function ($q) use ($keyword) {
                $q->where('full_name', 'like', "%{$keyword}%")
                    ->orWhere('email', 'like', "%{$keyword}%")
                    ->orWhere('phone', 'like', "%{$keyword}%");
            });
        }
        return $query;
    }

    public function scopeByStatus($query, $status)
    {
        if ($status !== null && $status !== '') {
            $query->where('status', $status);
        }
        return $query;
    }

    public function getIsOnlineAttribute(): bool
    {
        return $this->last_seen_at && $this->last_seen_at->greaterThan(now()->subSeconds(60));
    }
}
