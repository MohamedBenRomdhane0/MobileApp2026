<?php

namespace App\Models;

use App\Enum\MediaReviewStatusEnum;
use App\Traits\ApplyQueryScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\MediaMetadata;
use App\Models\MediaLike;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Media",
 *     type="object",
 *     title="Media",
 *     description="Media object schema",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="model_type", type="string", example="App\\Models\\User"),
 *     @OA\Property(property="model_id", type="integer", example=10),
 *     @OA\Property(property="file_name", type="string", example="image.jpg"),
 *     @OA\Property(property="mime_type", type="string", example="image/jpeg"),
 *     @OA\Property(property="file_path", type="string", example="/uploads/images/image.jpg"),
 *     @OA\Property(property="title", type="string", example="Profile Picture"),
 *     @OA\Property(property="description", type="string", example="User profile picture"),
 *     @OA\Property(property="size", type="integer", example=204800),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-06-01T12:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-06-01T12:00:00Z")
 * )
 */


class Media extends Model
{
    use HasFactory, SoftDeletes, ApplyQueryScopes;

    protected $fillable = [
        'model_type', 'model_id', 'file_name', 'creator_id', 'mime_type', 'media_type',
        'is_external', 'is_active', 'file_path', 'title', 'description', 'size', 'tag',
        'thumbnail', 'review_status', 'review_feedback', 'reviewed_at', 'reviewed_by',
    ];

    protected $casts = [
        'size'        => 'integer',
        'is_active'   => 'boolean',
        'reviewed_at' => 'datetime',
        'review_status' => MediaReviewStatusEnum::class,
    ];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    public function model()
    {
        return $this->morphTo();
    }

    public function metadata()
    {
        return $this->hasOne(MediaMetadata::class);
    }
    /**
     * The likes that belong to the media.
     * This is a polymorphic relation.
     * It allows us to like any model that uses this trait.
     */
    public function likes()
    {
        return $this->morphMany(MediaLike::class, 'likeable');
    }

    /**
     * Get the path to the media file.
     * This is a convenience method to access the file_path attribute.
     */
    public function getPathAttribute(): ?string
    {
        return $this->file_path;
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
        public function trackings()
    {
        return $this->hasMany(\App\Models\MediaTracking::class, 'media_id');
    }
    public function scopeByMediaType($query, $type) {
        if (!empty($type)) {
            $query->where('media_type', $type);
        }
        return $query;
    }
    public function scopeByKeyword($query, ?string $keyword)
    {
        if (!empty($keyword)) {
            $query->where('title', 'like', '%' . $keyword . '%');
        }
        return $query;
    }
    public function scopeByIsExternal($query, $isExternal) {
        if ($isExternal !== null && $isExternal !== '') {
            $query->where('is_external', filter_var($isExternal, FILTER_VALIDATE_BOOLEAN));
        }
        return $query;
    }

    public function scopeByMaterialId($query, $materialId) {
        if (!empty($materialId)) {
            $query->whereHasMorph('model', [BookPage::class, BookIcon::class], function ($q) use ($materialId) {
                $q->whereHas('book.levelMaterial', function ($q) use ($materialId) {
                    $q->where('material_id', $materialId);
                });
            });
        }
        return $query;
    }

    public function scopeByLevelId($query, $levelId) {
        if (!empty($levelId)) {
            $query->whereHasMorph('model', [BookPage::class, BookIcon::class], function ($q) use ($levelId) {
                $q->whereHas('book.levelMaterial', function ($q) use ($levelId) {
                    $q->where('level_id', $levelId);
                });
            });
        }
        return $query;
    }
}
