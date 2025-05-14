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

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['full_name', 'email', 'phone', 'password', 'status', 'email_verified_at'];

    /**
     * The attributes that should be hidden for arrays and JSON.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * JWT Identifier.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Custom JWT claims.
     */
    public function getJWTCustomClaims(): array
    {
        return [];
    }

    /**
     * One-to-one: Teacher profile
     */
    public function teacherProfile()
    {
        return $this->hasOne(TeacherProfile::class);
    }

    /**
     * One-to-one: Parent profile
     */
    public function parentProfile()
    {
        return $this->hasOne(ParentProfile::class);
    }

    /**
     * One-to-one: Child profile
     */
    public function childProfile()
    {
        return $this->hasOne(ChildProfile::class);
    }
    /**
     * One-to-many: User sessions
     */

    public function sessions()
    {
        return $this->hasMany(UserSession::class);
    }
    /**
     * One-to-many: User social accounts
     */

    public function socialAccounts()
    {
        return $this->hasMany(SocialAccount::class);
    }
    /**
     * One-to-many: User books, a user can create many books
     */

    public function books()
    {
        return $this->hasMany(Book::class);
    }
    /**
     * One-to-many: User media, a user can have many media
     */
    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }
    public function mediaLikes()
    {
        return $this->hasMany(MediaLike::class);
    }

    /**
     * Accessor for dynamic profile based on role
     */
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

    /**
     *  Profile type string based on role
     * @return string|null
     */
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
}
