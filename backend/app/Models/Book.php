<?php

namespace App\Models;

use App\Enum\MediaTagEnum;
use App\Services\BookAccessService;
use App\Traits\ApplyQueryScopes;
use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Models\LevelSectionMaterial;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Book extends Model
{
    use HasFactory, SoftDeletes, ApplyQueryScopes, HasTranslations;

    protected $fillable = [
        'level_material_id',
        'level_section_material_id',
        'title',
        'title_en',
        'type',
        'status',
        'user_id',
        'creator_id',
        'pages_total',
        'ingest_status',
        'pages_rendered',
        'is_valid',
        'language',
        'price',
        'conversion_status',
    ];

    protected $appends = ['title_fr', 'title_ar'];

    protected $casts = [
        'type' => 'integer',
        'status' => 'integer',
    ];

    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    /**
     * User who owns the book.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * User who originally created the book.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
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

    /**
     * Level section material of the book (new architecture).
     */
    public function levelSectionMaterial()
    {
        return $this->belongsTo(LevelSectionMaterial::class);
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'model');
    }

    public function cover()
    {
        return $this->morphOne(\App\Models\Media::class, 'model')->where('tag', \App\Enum\MediaTagEnum::BOOK_COVER->value);
    }

    /**
     * Plan accessible entities where this book is accessible
     */
    public function planAccessibleEntities()
    {
        return $this->morphMany(PlanAccessibleEntity::class, 'accessible');
    }

    /**
     * All videos linked to the book (book_video, icon_video).
     */
    public function videos()
    {
        return $this->media()->whereIn('tag', [MediaTagEnum::BOOK_MEDIA->value, MediaTagEnum::ICON_MEDIA->value]);
    }

    /**
     * Scopes for filtering and sorting
     */
    public function scopeFilterByTitle($query, $title)
    {
        if ($title) {
            $query->where('title', 'like', '%' . $title . '%');
        }
    }

    public function scopeFilterByType($query, $type)
    {
        if ($type) {
            $query->where('type', $type);
        }
    }

    public function scopeFilterByUserId($query, $userId)
    {
        if ($userId) {
            $query->where('user_id', $userId);
        }
    }

    public function scopeByExcludeUserId(Builder $query, ?int $excludeUserId): Builder
    {
        if ($excludeUserId) {
            $query->where('user_id', '!=', $excludeUserId);
        }

        return $query;
    }

    public function scopeFilterByLevelMaterialId($query, $levelMaterialId)
    {
        if ($levelMaterialId) {
            $query->where('level_material_id', $levelMaterialId);
        }
    }

    public function scopeByKeyword(Builder $query, ?string $keyword): Builder
    {
        if (!empty($keyword)) {
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', '%' . $keyword . '%')->orWhereHas('levelMaterial.material', function ($q) use ($keyword) {
                    $q->where('name', 'like', '%' . $keyword . '%');
                });
            });
        }

        return $query;
    }

    public function scopeByUserId(Builder $query, int $id): Builder
    {
        if (!empty($id)){
            $query->where('user_id', $id);
        }
        return $query;
    }

    public function scopeByStatus(Builder $query, string $status): Builder
    {
        if (!empty($status)) {
            $query->where('status', $status);
        }

        return $query;
    }

    public function scopeByIsValid(Builder $query, $isValid): Builder
    {
        if ($isValid !== null && $isValid !== '') {
            $query->where('is_valid', (int) $isValid);
        }

        return $query;
    }

    public function scopeByMinistryOnly(Builder $query, $ministryOnly): Builder
    {
        if ($ministryOnly) {
            $query->where(function ($q) {
                $q->whereNotNull('level_material_id')
                  ->orWhereNotNull('level_section_material_id');
            });
        }

        return $query;
    }

    public function scopeByHasTitle(Builder $query, $hasTitle): Builder
    {
        if ($hasTitle) {
            $query->whereNotNull('title');
        }

        return $query;
    }

    public function scopeVisibleTo(Builder $query, ?User $user)
    {
        return BookAccessService::applyVisibilityScope($query, $user);
    }

    public function scopeByLevelId(Builder $query, ?int $levelId)
    {
        if ($levelId) {
            return $query->where(function ($q) use ($levelId) {
                $q->whereHas('levelMaterial', function ($q2) use ($levelId) {
                    $q2->where('level_id', $levelId);
                })->orWhereHas('levelSectionMaterial.levelSection', function ($q2) use ($levelId) {
                    $q2->where('level_id', $levelId);
                });
            });
        }

        return $query;
    }

    public function modules()
    {
        return $this->hasMany(BookModule::class)->orderBy('order');
    }

    public function pages()
    {
        return $this->hasMany(\App\Models\BookPage::class)->orderBy('page_number');
    }

    public function scopeByMaterial($query, int $materialId)
    {
        if (!empty($materialId)) {
            return $query->whereHas('levelMaterial', function ($q) use ($materialId) {
                $q->where('material_id', $materialId);
            });
        }

        return $query;
    }

    public function scopeByMaterialId($query, $materialId)
    {
        if (!empty($materialId)) {
            return $query->where(function ($q) use ($materialId) {
                $q->whereHas('levelMaterial', function ($q2) use ($materialId) {
                    $q2->where('material_id', $materialId);
                })->orWhereHas('levelSectionMaterial', function ($q2) use ($materialId) {
                    $q2->where('material_id', $materialId);
                });
            });
        }

        return $query;
    }

    public function scopeByLevelSectionMaterialId(Builder $query, ?int $levelSectionMaterialId): Builder
    {
        if (!empty($levelSectionMaterialId)) {
            $lsm = LevelSectionMaterial::find($levelSectionMaterialId);

            if ($lsm && $lsm->sharing_group) {
                $levelId = $lsm->levelSection->level_id;
                $siblingIds = LevelSectionMaterial::where('sharing_group', $lsm->sharing_group)
                    ->where('material_id', $lsm->material_id)
                    ->whereHas('levelSection', fn($q) => $q->where('level_id', $levelId))
                    ->pluck('id');

                $query->whereIn('level_section_material_id', $siblingIds);
            } else {
                $query->where('level_section_material_id', $levelSectionMaterialId);
            }
        }

        return $query;
    }

    protected function titleFr(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getTranslation('title', 'fr')
        );
    }

    protected function titleAr(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getTranslation('title', 'ar')
        );
    }
}