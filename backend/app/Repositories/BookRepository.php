<?php

namespace App\Repositories;

use App\Enum\DiskEnum;
use App\Enum\MediaTagEnum;
use App\Enum\RoleEnum;
use App\Helpers\QueryConfig;
use App\Models\Book;
use App\Models\BookUserTracking;
use App\Repositories\BookModuleRepository;
use App\Repositories\MediaRepository;
use App\Models\BookIcon;
use App\Models\LevelMaterial;
use App\Models\Media;
use App\Models\MediaLike;
use App\Models\User;
use App\Traits\PaginationParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BookRepository
{
    use PaginationParams;

public static function countsByLevel(User $user): array
{
    $fromLevelMaterial = Book::query()
        ->visibleTo($user)
        ->join('level_materials', 'books.level_material_id', '=', 'level_materials.id')
        ->selectRaw('level_materials.level_id as level_id, COUNT(*) as c')
        ->groupBy('level_materials.level_id')
        ->pluck('c', 'level_id');

    $fromLevelSectionMaterial = Book::query()
        ->visibleTo($user)
        ->join('level_section_materials', 'books.level_section_material_id', '=', 'level_section_materials.id')
        ->join('level_sections', 'level_section_materials.level_section_id', '=', 'level_sections.id')
        ->selectRaw('level_sections.level_id as level_id, COUNT(*) as c')
        ->groupBy('level_sections.level_id')
        ->pluck('c', 'level_id');

    $counts = [];
    foreach ($fromLevelMaterial as $levelId => $c) {
        $counts[(int) $levelId] = ($counts[(int) $levelId] ?? 0) + (int) $c;
    }
    foreach ($fromLevelSectionMaterial as $levelId => $c) {
        $counts[(int) $levelId] = ($counts[(int) $levelId] ?? 0) + (int) $c;
    }

    return $counts;
}

public static function trackBookOpen(int $bookId, int $userId, ?int $page = null): BookUserTracking
{
    $tracking = BookUserTracking::firstOrCreate(
        ['book_id' => $bookId, 'user_id' => $userId],
        ['started_at' => now()],
    );

    $tracking->last_accessed_at = now();
    if ($page !== null) {
        $tracking->last_page = $page;
    }
    $tracking->save();

    return $tracking;
}

public static function index(QueryConfig $queryConfig): LengthAwarePaginator|Collection
{
    $user = Auth::user();

    $query = Book::with([
            'user',
            'levelMaterial.material',
            'levelMaterial.level',
            'levelSectionMaterial.levelSection.level',
            'levelSectionMaterial.levelSection.section',
            'levelSectionMaterial.material',
            'media',
            'media.metadata',
            'icons.media',
        ])
        ->addSelect([
                'videos_count' => Media::query()
                    ->selectRaw('COUNT(*)')
                    ->where('tag', MediaTagEnum::ICON_MEDIA->value)
                    ->where('model_type', BookIcon::class)
                    ->whereIn('model_id', function ($sub) {
                        $sub->select('id')
                            ->from('book_icons')
                            ->whereColumn('book_icons.book_id', 'books.id');
                    }),
            ])
        ->visibleTo($user);

    Book::applyFilters($queryConfig->getFilters(), $query);

    $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

    $books = $queryConfig->getPaginated()
        ? $query->paginate($queryConfig->getPerPage())
        : $query->get();

    $collection = $books instanceof \Illuminate\Pagination\AbstractPaginator
        ? $books->getCollection()
        : $books;

    $bookIds = $collection
        ->pluck('id')
        ->filter()
        ->map(fn ($id) => (int) $id)
        ->values();

    $teachersByBookId = collect();
    $teachersById = collect();

    if ($bookIds->isNotEmpty()) {
        $teacherPivotRows = Media::query()
            ->join('book_icons', 'book_icons.id', '=', 'media.model_id')
            ->where('media.tag', MediaTagEnum::ICON_MEDIA->value)
            ->where('media.model_type', BookIcon::class)
            ->whereNotNull('media.creator_id')
            ->whereIn('book_icons.book_id', $bookIds)
            ->select([
                'book_icons.book_id',
                'media.creator_id',
            ])
            ->distinct()
            ->get();

        $teacherIds = $teacherPivotRows
            ->pluck('creator_id')
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        $teachersById = User::query()
            ->whereIn('id', $teacherIds)
            ->get()
            ->keyBy('id');

        $teachersByBookId = $teacherPivotRows
            ->groupBy('book_id')
            ->map(function ($rows) use ($teachersById) {
                return collect($rows)
                    ->map(function ($row) use ($teachersById) {
                        $teacher = $teachersById->get((int) $row->creator_id);

                        if (!$teacher) {
                            return null;
                        }

                        $avatar = data_get($teacher, 'avatar_url')
                            ?? data_get($teacher, 'avatarUrl')
                            ?? data_get($teacher, 'avatar')
                            ?? null;

                        return [
                            'id' => (int) $teacher->id,
                            'full_name' => (string) ($teacher->full_name ?? ''),
                            'fullName' => (string) ($teacher->full_name ?? ''),
                            'avatar_url' => $avatar,
                            'avatarUrl' => $avatar,
                            'avatar' => $avatar,
                        ];
                    })
                    ->filter()
                    ->values();
            });
    }

    $userId = $user?->id ?? 0;

    $modulesByBookId = BookModuleRepository::getModulesWithProgressForBooks(
        $books->pluck('id')->toArray(),
        $userId
    );

    $teacherVideosByBook = collect();
    $teacherViewsByBook  = collect();
    $teacherLikesByBook  = collect();

    if ($bookIds->isNotEmpty()) {
        $teacherVideosByBook = DB::table('book_icons')
            ->join('media', function ($join) use ($userId) {
                $join->on('media.model_id', '=', 'book_icons.id')
                     ->where('media.model_type', '=', BookIcon::class)
                     ->where('media.tag', '=', MediaTagEnum::ICON_MEDIA->value)
                     ->where('media.creator_id', '=', $userId)
                     ->whereNull('media.deleted_at');
            })
            ->whereIn('book_icons.book_id', $bookIds)
            ->whereNull('book_icons.deleted_at')
            ->groupBy('book_icons.book_id')
            ->select('book_icons.book_id', DB::raw('COUNT(DISTINCT media.id) as teacher_videos'))
            ->get()
            ->keyBy('book_id');

        $teacherViewsByBook = DB::table('book_icons')
            ->join('media', function ($join) use ($userId) {
                $join->on('media.model_id', '=', 'book_icons.id')
                     ->where('media.model_type', '=', BookIcon::class)
                     ->where('media.tag', '=', MediaTagEnum::ICON_MEDIA->value)
                     ->where('media.creator_id', '=', $userId)
                     ->whereNull('media.deleted_at');
            })
            ->leftJoin('media_metadata', 'media_metadata.media_id', '=', 'media.id')
            ->whereIn('book_icons.book_id', $bookIds)
            ->whereNull('book_icons.deleted_at')
            ->groupBy('book_icons.book_id')
            ->select('book_icons.book_id', DB::raw('COALESCE(SUM(media_metadata.views), 0) as teacher_views'))
            ->get()
            ->keyBy('book_id');

        $teacherLikesByBook = DB::table('book_icons')
            ->join('media', function ($join) use ($userId) {
                $join->on('media.model_id', '=', 'book_icons.id')
                     ->where('media.model_type', '=', BookIcon::class)
                     ->where('media.tag', '=', MediaTagEnum::ICON_MEDIA->value)
                     ->where('media.creator_id', '=', $userId)
                     ->whereNull('media.deleted_at');
            })
            ->join('media_likes', function ($join) {
                $join->on('media_likes.likeable_id', '=', 'media.id')
                     ->where('media_likes.likeable_type', '=', Media::class);
            })
            ->whereIn('book_icons.book_id', $bookIds)
            ->whereNull('book_icons.deleted_at')
            ->groupBy('book_icons.book_id')
            ->select('book_icons.book_id', DB::raw('COUNT(media_likes.id) as teacher_likes'))
            ->get()
            ->keyBy('book_id');
    }

    $collection->transform(function ($book) use ($teachersByBookId, $modulesByBookId, $teacherVideosByBook, $teacherViewsByBook, $teacherLikesByBook) {
        $total = (int) $book->icons_total_count;
        $done = (int) $book->icons_with_media_count;
        $book->progress = $total > 0 ? round(($done / $total) * 100) : 0;

        $mat = optional(optional($book->levelMaterial)->material);

        $book->material = $mat->id ? [
            'id' => $mat->id,
            'name' => $mat->name,
        ] : null;

        $book->material_id = $mat->id ?? null;
        $book->material_name = $mat->name ?? null;

        $teachers = $teachersByBookId->get((int) $book->id, collect());

        $book->teachers = $teachers->values();
        $book->teachers_count = $teachers->count();

        $book->modules = $modulesByBookId[(int) $book->id] ?? [];

        $bookId = (int) $book->id;
        $sales = 0;
        $book->teacher_stats = [
            'videos' => (int) ($teacherVideosByBook->get($bookId)->teacher_videos ?? 0),
            'views'  => (int) ($teacherViewsByBook->get($bookId)->teacher_views ?? 0),
            'likes'  => (int) ($teacherLikesByBook->get($bookId)->teacher_likes ?? 0),
            'sales'  => $sales,
        ];

        return $book;
    });

    return $books;
}
    /**
     * Get a book by its ID
     * @param int $id
     * @return Book|null
     */
    public static function getBookById(int $id): ?Book
    {
        $book = Book::with([
                'user',
                'levelMaterial.material',
                'levelMaterial.level',
                'levelSectionMaterial.levelSection.level',
                'levelSectionMaterial.levelSection.section',
                'levelSectionMaterial.material',
                'media',
                'icons' => fn ($q) => $q->withCount([
                    'media as media_count' => fn ($m) => $m->where('tag', MediaTagEnum::ICON_MEDIA->value),
                    'media as auth_teacher_media_count' => fn ($m) => $m
                        ->where('tag', MediaTagEnum::ICON_MEDIA->value)
                        ->where('creator_id', request()->user()?->id ?? 0),
                ]),
                'pages',
                'modules',
            ])->find($id);

        if (!$book) {
            throw new \Exception(__('book.not_found'), 404);
        }

        $userId = request()->user()?->id;
        $tracking = $userId
            ? BookUserTracking::where('book_id', $id)->where('user_id', $userId)->first()
            : null;

        $book->has_started = (bool) $tracking;
        $book->last_page = $tracking?->last_page;

        return $book;
    }

    /**
     * Store a new book
     * @param array $data
     * @return Book
     */
    public static function storeBook(array $data): Book
    {
        $user = request()->user();
        $isAdmin = $user->hasRole(RoleEnum::ADMIN->value);

        $book = Book::create([
            'level_material_id'          => $data['level_material_id'] ?? null,
            'level_section_material_id'  => $data['level_section_material_id'] ?? null,
            'title'                      => $data['title'] ?? $data['title_fr'] ?? $data['title_ar'] ?? null,
            'title_en'                   => $data['title_en'] ?? null,
            'type'                       => $data['type'] ?? null,
            'user_id'                    => auth()->id(),
            'status'                     => $data['status'],
            'is_valid'                   => $isAdmin ? true : false,
            'language'                   => $data['language'] ?? null,
            'price'                      => $data['price'] ?? null,
        ]);

        if (!empty($data['title_fr'])) {
            $book->setTranslation('title', 'fr', $data['title_fr']);
        }

        if (!empty($data['title_ar'])) {
            $book->setTranslation('title', 'ar', $data['title_ar']);
        }

        if (!empty($data['media_file_path'])) {
            $media = MediaRepository::uploadMedia(
                model: $book,
                path: $data['media_file_path'],
                disk: DiskEnum::S3->value,
                folder: $data['folder'] ?? 'uploads/books',
                title: $data['media_title'] ?? null,
                description: $data['media_description'] ?? null,
                tag: MediaTagEnum::BOOK_PDF->value
            );
            $media->creator_id = auth()->id();
            $book->media()->save($media);
        }

        if (!empty($data['cover_image'])) {
            $cover = MediaRepository::uploadMedia(
                model: $book,
                path: $data['cover_image'],
                disk: DiskEnum::S3->value,
                folder: $data['folder'] ?? 'uploads/books/covers',
                title: 'Book Cover',
                description: null,
                tag: MediaTagEnum::BOOK_COVER->value
            );
            $book->media()->save($cover);
        }

        return $book;
    }

    /**
     * Update an existing book
     * @param Book $book
     * @param array $data
     * @return Book
     */
    public static function updateBook(Book $book, array $data): Book
    {
        $attributes = [];

        if (array_key_exists('level_section_material_id', $data)) {
            $attributes['level_section_material_id'] = $data['level_section_material_id'];
            $attributes['level_material_id'] = null;
        } elseif (array_key_exists('level_id', $data) && array_key_exists('material_id', $data) && $data['level_id'] && $data['material_id']) {
            $levelMaterialId = LevelMaterial::where('level_id', $data['level_id'])
                ->where('material_id', $data['material_id'])
                ->firstOrFail()
                ->id;

            $attributes['level_material_id'] = $levelMaterialId;
        }

        if (array_key_exists('title', $data)) {
            $attributes['title'] = $data['title'];
        }

        if (array_key_exists('title_en', $data)) {
            $attributes['title_en'] = $data['title_en'];
        }

        if (array_key_exists('type', $data)) {
            $attributes['type'] = $data['type'];
        }

        if (array_key_exists('status', $data)) {
            $attributes['status'] = $data['status'];
        }

        if (array_key_exists('language', $data)) {
            $attributes['language'] = $data['language'];
        }

        if (array_key_exists('price', $data)) {
            $attributes['price'] = $data['price'];
        }

        if (!empty($attributes)) {
            $book->update($attributes);
        }

        if (array_key_exists('title_fr', $data)) {
            $book->setTranslation('title', 'fr', $data['title_fr']);
        }

        if (array_key_exists('title_ar', $data)) {
            $book->setTranslation('title', 'ar', $data['title_ar']);
        }

        if (!empty($data['media_file_path'])) {
            $book->media()->where('tag', MediaTagEnum::BOOK_PDF->value)->delete();

            $media = MediaRepository::uploadMedia(
                model: $book,
                path: $data['media_file_path'],
                disk: DiskEnum::PUBLIC->value,
                folder: $data['folder'] ?? 'uploads/books',
                title: $data['media_title'] ?? null,
                description: $data['media_description'] ?? null,
                tag: MediaTagEnum::BOOK_PDF->value
            );
            $book->media()->save($media);
        }

        if (!empty($data['cover_image'])) {
            $existing = $book->cover()->first();
            if ($existing) {
                MediaRepository::deleteMediaFile($existing->file_path, DiskEnum::S3->value);
                $existing->forceDelete();
            }

            MediaRepository::uploadMedia(
                model: $book,
                path: $data['cover_image'],
                disk: DiskEnum::S3->value,
                folder: 'uploads/books/covers',
                title: 'Book Cover',
                description: null,
                tag: MediaTagEnum::BOOK_COVER->value
            );
        }

        return $book->fresh([
            'media',
            'levelMaterial.material',
            'levelMaterial.level',
            'levelSectionMaterial.levelSection.level',
            'levelSectionMaterial.levelSection.section',
            'levelSectionMaterial.material',
            'icons',
            'pages',
        ]);
    }

    /**
     * Delete a book
     * @param Book $book
     * @return void
     */
    public static function deleteBook(Book $book): void
    {
        DB::transaction(function () use ($book) {
            $book->pages()->delete();
            $book->icons()->delete();

            if ($book->media()->exists()) {
                foreach ($book->media as $media) {
                    if (Storage::exists($media->file_path)) {
                        Storage::delete($media->file_path);
                    }
                }
                $book->media()->delete();
            }

            $book->delete();
        });
    }

    /**
     * Store book icons
     * @param Book $book
     * @param array $icon
     * @return \App\Models\BookIcon
     */
    public static function storeBookIcon(Book $book, array $icon): BookIcon
    {
        return $book->icons()->create([
            'page'      => $icon['page'],
            'x'         => $icon['x'],
            'y'         => $icon['y'],
            'icon_type' => $icon['icon_type'],
            'size'      => $icon['size'] ?? 24,
            'title'     => $icon['title'] ?? null,
        ]);
    }

    /**
     * Resize book icon
     * @param string $iconId
     * @param int $size
     * @return void
     */
    public static function resizeBookIcon(string $iconId, int $size): void
    {
        $book = Book::whereHas('icons', function ($query) use ($iconId) {
            $query->where('id', $iconId);
        })->firstOrFail();

        $icon = self::getBookIconById($book, $iconId);
        $icon->size = $size;
        $icon->save();
    }

    /**
     * Update book icons
     * @param Book $book
     * @param string $iconId
     * @param array $data
     * @return void
     */
    public static function updateBookIcon(Book $book, string $iconId, array $data): void
    {
        $icon = self::getBookIconById($book, $iconId);

        $updateData = [
            'page'      => $data['page'],
            'x'         => $data['x'],
            'y'         => $data['y'],
            'icon_type' => $data['icon_type'],
        ];
        if (array_key_exists('title', $data)) {
            $updateData['title'] = $data['title'];
        }
        $icon->update($updateData);
    }

    /**
     * Delete book icons
     * @param Book $book
     * @param string $iconId
     * @return void
     */
    public static function deleteBookIconsByIds(Book $book, string $iconId): void
    {
        $icon = $book->icons()->where('id', $iconId)->first();

        if ($icon) {
            $icon->media()->update([
                'model_type' => Book::class,
                'model_id'   => 0,
            ]);

            $icon->delete();
        }
    }

    /**
     * Delete book icon by id with media related to it
     * @param Book $book
     * @param string $iconId
     * @return void
     */
    public static function deleteBookIconById(Book $book, string $iconId): void
    {
        $icon = self::getBookIconById($book, $iconId);

        $icon->media()->delete();
        $icon->delete();
    }

    /**
     * Get a specific icon by its ID and make sure it belongs to the book
     *
     * @param Book $book
     * @param string $iconId
     * @return \App\Models\BookIcon
     * @throws \Exception
     */
    public static function getBookIconById(Book $book, string $iconId): BookIcon
    {
        $icon = $book->icons()->with('media.creator')->where('id', $iconId)->first();

        if (!$icon) {
            throw new \Exception(__('book.icon_not_found'), 404);
        }

        return $icon;
    }

    /**
     * Get media videos for a specific icon with permission checks and "like" status.
     *
     * @param int $iconId
     * @param QueryConfig $queryConfig
     * @return LengthAwarePaginator|Collection
     * @throws \Exception
     */
    public static function getMediaForIcon(int $iconId, QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $user = request()->user();

        $icon = BookIcon::with(['book.levelMaterial'])->find($iconId);

        if (!$icon || !$icon->book || !$icon->book->levelMaterial) {
            throw new \Exception(__('messages.icon.not_found'), HttpResponse::HTTP_NOT_FOUND);
        }

        self::validateUserAccessToLevel($user, $icon->book->levelMaterial->level_id);

        $mediaQuery = $icon
            ->media()
            ->with(['creator', 'metadata'])
            ->where('tag', MediaTagEnum::ICON_MEDIA->value)
            ->withCount('likes')
            ->withExists([
                'likes' => function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                },
            ])
            ->withCount([
                'trackings as views' => function ($q) {
                    $q->whereNotNull('started_at');
                },
            ]);

        Media::applyFilters($queryConfig->getFilters(), $mediaQuery);
        $mediaQuery->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

        return $queryConfig->getPaginated()
            ? $mediaQuery->paginate($queryConfig->getPerPage())->through(fn ($m) => self::mapMediaState($m))
            : $mediaQuery->get()->map(fn ($m) => self::mapMediaState($m));
    }

    /**
     * check if a user has access to a specific level.
     */
    protected static function validateUserAccessToLevel($user, $bookLevelId): void
    {
        $effectiveLevelId = $user->level_id ?? ($user->child->level_id ?? ($user->profile->level_id ?? null));

        if ($bookLevelId && $effectiveLevelId && $bookLevelId !== $effectiveLevelId) {
            throw new \Exception(__('messages.icon.forbidden'), HttpResponse::HTTP_FORBIDDEN);
        }
    }

    protected static function mapMediaState(Media $media): Media
    {
        $media->is_liked = $media->likes_exists;
        return $media;
    }

    /**
     * get all videos for a user
     * @param QueryConfig $queryConfig
     * @return LengthAwarePaginator|Collection
     */
    public static function indexVideos(QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $user = request()->user();
        $filters = $queryConfig->getFilters();

        $query = Media::with(['model', 'model.book.levelMaterial.material', 'model.book.levelMaterial.level', 'model.book.media', 'metadata'])
            ->withCount('likes')
            ->where(function ($q) {
                $q->where('tag', MediaTagEnum::BOOK_MEDIA->value)
                  ->orWhere('tag', MediaTagEnum::ICON_MEDIA->value);
            })
            ->where('creator_id', $user->id);

        Media::applyFilters($filters, $query);

        if (!empty($filters['level_id'])) {
            $query->byLevelId($filters['level_id']);
        }

        if (!empty($filters['material_id'])) {
            $query->byMaterialId($filters['material_id']);
        }

        $orderBy = $queryConfig->getOrderBy();
        $direction = $queryConfig->getDirection();
        if ($orderBy === 'views') {
            $query->leftJoin('media_metadata', 'media.id', '=', 'media_metadata.media_id')
                  ->orderBy('media_metadata.views', $direction)
                  ->select('media.*');
        } elseif ($orderBy === 'likes_count') {
            $query->orderBy('likes_count', $direction);
        } else {
            $query->orderBy('media.' . $orderBy, $direction);
        }

        if ($queryConfig->getPaginated()) {
            return $query->paginate($queryConfig->getPerPage());
        }

        return $query->get();
    }

    public static function getIconMediaPicker(int|string $iconId, QueryConfig $queryConfig): array
    {
        return DB::transaction(function () use ($iconId, $queryConfig) {
            $assignedQuery = Media::query()
                ->where('model_type', BookIcon::class)
                ->where('model_id', $iconId)
                ->with(['metadata', 'creator:id,full_name'])
                ->withCount('likes');

            $authUserId = request()->user()?->id;

            $availableQuery = Media::query()
                ->where('model_type', Book::class)
                ->where(function ($q) {
                    $q->whereNull('model_id')->orWhere('model_id', 0);
                })
                ->when($authUserId, fn ($q) => $q->where('creator_id', $authUserId));

            Media::applyFilters($queryConfig->getFilters(), $assignedQuery);
            Media::applyFilters($queryConfig->getFilters(), $availableQuery);

            $assignedQuery->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());
            $availableQuery->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

            $perPage = $queryConfig->getPerPage();

            $mapAssigned = static fn (Media $media) => [
                'id'           => $media->id,
                'title'        => $media->title,
                'thumbnail'    => $media->thumbnail,
                'media_type'   => $media->media_type,
                'is_external'  => (bool) $media->is_external,
                'file_path'    => $media->file_path,
                'views'        => $media->metadata?->views ?? 0,
                'likes_count'  => $media->likes_count ?? 0,
                'creator_id'   => $media->creator_id,
                'creator_name' => $media->creator?->full_name ?? null,
            ];

            $mapAvailable = static fn (Media $media) => [
                'id'          => $media->id,
                'title'       => $media->title,
                'thumbnail'   => $media->thumbnail,
                'media_type'  => $media->media_type,
                'is_external' => (bool) $media->is_external,
                'file_path'   => $media->file_path,
            ];

            $assigned = $assignedQuery
                ->limit($perPage)
                ->get()
                ->map($mapAssigned)
                ->values();

            $assignedIds = $assigned->pluck('id')->all();

            $available = $availableQuery
                ->when(!empty($assignedIds), fn ($q) => $q->whereNotIn('id', $assignedIds))
                ->limit($perPage)
                ->get()
                ->map($mapAvailable)
                ->values();

            $summary = self::buildIconContentSummary($assigned);

            return [
                'assigned' => $assigned,
                'available' => $available,
                'summary'  => $summary,
            ];
        });
    }

    private static function buildIconContentSummary(\Illuminate\Support\Collection $assigned): array
    {
        $totalViews = $assigned->sum('views');
        $totalLikes = $assigned->sum('likes_count');

        $teachers = $assigned
            ->filter(fn ($item) => !empty($item['creator_name']))
            ->groupBy('creator_id')
            ->map(fn ($items) => [
                'id'    => $items->first()['creator_id'],
                'name'  => $items->first()['creator_name'],
                'count' => $items->count(),
            ])
            ->values();

        $videoCount    = $assigned->filter(fn ($m) => !$m['is_external'] && $m['media_type'] === 'video')->count();
        $docsCount     = $assigned->filter(fn ($m) => !$m['is_external'] && in_array($m['media_type'], ['pdf', 'document', 'image', 'audio']))->count();
        $linkCount     = $assigned->filter(fn ($m) => (bool) $m['is_external'])->count();

        return [
            'total_count'   => $assigned->count(),
            'total_views'   => $totalViews,
            'total_likes'   => $totalLikes,
            'teachers'      => $teachers,
            'content_types' => [
                'video' => $videoCount,
                'docs'  => $docsCount,
                'link'  => $linkCount,
            ],
        ];
    }

    public static function getBatchIconStationContent(array $iconIds): array
    {
        $icons = BookIcon::with('book:id,title')->whereIn('id', $iconIds)->get()->keyBy('id');

        $mediaByIcon = Media::query()
            ->where('model_type', BookIcon::class)
            ->whereIn('model_id', $iconIds)
            ->where('tag', MediaTagEnum::ICON_MEDIA->value)
            ->with(['metadata', 'creator:id,full_name'])
            ->withCount('likes')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('model_id');

        $result = [];

        foreach ($iconIds as $iconId) {
            $icon      = $icons->get($iconId);
            $bookTitle = $icon?->book?->title;
            $media     = $mediaByIcon->get($iconId, collect());

            $mapMedia = static function (Media $m) use ($bookTitle) {
                $creator  = $m->creator;
                $metadata = $m->metadata;

                $material = null;
                if ($creator) {
                    $lm       = $creator->teacherLevelMaterials()->with('levelMaterial.material')->first();
                    $material = $lm?->levelMaterial?->material?->name_fr
                        ?? $lm?->levelMaterial?->material?->name_en
                        ?? null;
                }

                $followersCount = $creator ? $creator->followers()->count() : 0;

                return [
                    'id'           => $m->id,
                    'title'        => $m->title,
                    'thumbnail'    => $m->thumbnail,
                    'media_type'   => $m->media_type,
                    'is_external'  => (bool) $m->is_external,
                    'file_path'    => $m->file_path,
                    'size'         => $m->size,
                    'published_at' => $m->created_at?->format('M j'),
                    'views'        => $metadata?->views ?? 0,
                    'likes_count'  => $m->likes_count ?? 0,
                    'book_title'   => $bookTitle,
                    'creator' => $creator ? [
                        'id'        => $creator->id,
                        'full_name' => $creator->full_name,
                        'avatar'    => $creator->avatar ?? null,
                        'followers' => $followersCount,
                        'material'  => $material,
                    ] : null,
                ];
            };

            $items = $media->map($mapMedia)->values();

            $result[$iconId] = [
                'items'   => $items,
                'by_type' => [
                    'video'    => $items->filter(fn ($m) => !$m['is_external'] && $m['media_type'] === 'video')->values(),
                    'document' => $items->filter(fn ($m) => !$m['is_external'] && in_array($m['media_type'], ['pdf', 'document']))->values(),
                    'audio'    => $items->filter(fn ($m) => !$m['is_external'] && $m['media_type'] === 'audio')->values(),
                    'image'    => $items->filter(fn ($m) => !$m['is_external'] && $m['media_type'] === 'image')->values(),
                    'link'     => $items->filter(fn ($m) => (bool) $m['is_external'])->values(),
                ],
            ];
        }

        return $result;
    }

    public static function getIconStationContent(int|string $iconId, ?int $childId = null): array
    {
        $icon = BookIcon::with('book:id,title')->find($iconId);
        $bookTitle = $icon?->book?->title;

        $media = Media::query()
            ->where('model_type', BookIcon::class)
            ->where('model_id', $iconId)
            ->where('tag', MediaTagEnum::ICON_MEDIA->value)
            ->with(['metadata', 'creator:id,full_name'])
            ->withCount('likes')
            ->orderBy('created_at', 'desc')
            ->get();

        $likedMediaIds = $childId
            ? MediaLike::where('user_id', $childId)
                ->where('likeable_type', Media::class)
                ->whereIn('likeable_id', $media->pluck('id'))
                ->pluck('likeable_id')
                ->all()
            : [];

        $creatorIds = $media->pluck('creator.id')->filter()->unique()->values();
        $followedTeacherIds = ($childId && $creatorIds->isNotEmpty())
            ? DB::table('teacher_followers')
                ->where('child_id', $childId)
                ->whereIn('teacher_id', $creatorIds)
                ->pluck('teacher_id')
                ->all()
            : [];

        $mapMedia = static function (Media $m) use ($bookTitle, $likedMediaIds, $followedTeacherIds) {
            $creator    = $m->creator;
            $metadata   = $m->metadata;

            $material = null;
            if ($creator) {
                $lm = $creator->teacherLevelMaterials()->with('levelMaterial.material')->first();
                $material = $lm?->levelMaterial?->material?->name_fr
                    ?? $lm?->levelMaterial?->material?->name_en
                    ?? null;
            }

            $followersCount = $creator
                ? $creator->followers()->count()
                : 0;

            return [
                'id'           => $m->id,
                'title'        => $m->title,
                'thumbnail'    => $m->thumbnail,
                'media_type'   => $m->media_type,
                'is_external'  => (bool) $m->is_external,
                'file_path'    => $m->file_path,
                'size'         => $m->size,
                'published_at' => $m->created_at?->format('M j'),
                'views'        => $metadata?->views ?? 0,
                'likes_count'  => $m->likes_count ?? 0,
                'is_liked'     => in_array($m->id, $likedMediaIds),
                'book_title'   => $bookTitle,
                'creator' => $creator ? [
                    'id'           => $creator->id,
                    'full_name'    => $creator->full_name,
                    'avatar'       => $creator->avatar ?? null,
                    'followers'    => $followersCount,
                    'material'     => $material,
                    'is_following' => in_array($creator->id, $followedTeacherIds),
                ] : null,
            ];
        };

        $items = $media->map($mapMedia)->values();

        $byType = [
            'video'    => $items->filter(fn ($m) => !$m['is_external'] && $m['media_type'] === 'video')->values(),
            'document' => $items->filter(fn ($m) => !$m['is_external'] && in_array($m['media_type'], ['pdf', 'document']))->values(),
            'audio'    => $items->filter(fn ($m) => !$m['is_external'] && $m['media_type'] === 'audio')->values(),
            'image'    => $items->filter(fn ($m) => !$m['is_external'] && $m['media_type'] === 'image')->values(),
            'link'     => $items->filter(fn ($m) => (bool) $m['is_external'])->values(),
        ];

        return [
            'items'   => $items,
            'by_type' => $byType,
        ];
    }

    public static function getChannelMediaStats(): array
    {
        $user = request()->user();

        $statsRow = Media::query()
            ->leftJoin('media_metadata as md', 'md.media_id', '=', 'media.id')
            ->where('media.creator_id', $user->id)
            ->whereIn('media.tag', [MediaTagEnum::BOOK_MEDIA->value, MediaTagEnum::ICON_MEDIA->value])
            ->selectRaw("SUM(CASE WHEN media.is_external = 1 THEN 1 ELSE 0 END) as external")
            ->selectRaw("SUM(CASE WHEN (media.is_external = 0 OR media.is_external IS NULL) AND media.media_type = 'video' THEN 1 ELSE 0 END) as video")
            ->selectRaw("SUM(CASE WHEN (media.is_external = 0 OR media.is_external IS NULL) AND media.media_type = 'image' THEN 1 ELSE 0 END) as image")
            ->selectRaw("SUM(CASE WHEN (media.is_external = 0 OR media.is_external IS NULL) AND media.media_type = 'audio' THEN 1 ELSE 0 END) as audio")
            ->selectRaw("SUM(CASE WHEN (media.is_external = 0 OR media.is_external IS NULL) AND media.media_type = 'pdf' THEN 1 ELSE 0 END) as pdf")
            ->selectRaw('COALESCE(SUM(md.views), 0) as views')
            ->selectRaw('COALESCE(SUM(md.watch_time), 0) as watch_time')
            ->first();

        $likesTotal = (int) MediaLike::query()
            ->from('media_likes as ml')
            ->join('media', function ($join) {
                $join->on('ml.likeable_id', '=', 'media.id');
            })
            ->where('ml.likeable_type', Media::class)
            ->where('media.creator_id', $user->id)
            ->whereIn('media.tag', [MediaTagEnum::BOOK_MEDIA->value, MediaTagEnum::ICON_MEDIA->value])
            ->count('ml.id');

        $watchTime = (int) ($statsRow->watch_time ?? 0);

        return [
            'video' => (int) ($statsRow->video ?? 0),
            'image' => (int) ($statsRow->image ?? 0),
            'audio' => (int) ($statsRow->audio ?? 0),
            'pdf' => (int) ($statsRow->pdf ?? 0),
            'external' => (int) ($statsRow->external ?? 0),
            'likes' => $likesTotal,
            'views' => (int) ($statsRow->views ?? 0),
            'minutesWatched' => (int) floor($watchTime / 60),
        ];
    }

    /**
     * Toggle like for any likeable model
     *
     * @param Model $model
     * @return bool True if liked, false if unliked
     */
    public static function toggleLike(Model $model): bool
    {
        $user = request()->user();

        $existing = MediaLike::where('user_id', $user->id)
            ->where('likeable_type', get_class($model))
            ->where('likeable_id', $model->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return false;
        }

        MediaLike::create([
            'user_id'       => $user->id,
            'likeable_type' => get_class($model),
            'likeable_id'   => $model->id,
        ]);

        return true;
    }

    public static function setBookLanguage(Book $book, string $language): Book
    {
        $book->language = $language;
        $book->save();

        return $book;
    }

    /**
     * Delete a specific video
     * @param Media $media
     * @return void
     */
    public static function deleteVideo(Media $media): void
    {
        if ($media->file_path) {
            MediaRepository::deleteMediaFile($media->file_path, $media->disk);
        }

        $media->delete();
    }

    /**
     * Sync videos for a given icon.
     *
     * @param \Illuminate\Support\Collection|array $assignIds
     * @param \Illuminate\Support\Collection|array $unassignIds
     * @param BookIcon $icon
     * @return array
     */
    public static function syncVideosForIcon($assignIds, $unassignIds, BookIcon $icon): array
    {
        if (!empty($assignIds)) {
            Media::whereIn('id', $assignIds)->update([
                'model_type' => BookIcon::class,
                'model_id'   => $icon->id,
                'tag'        => MediaTagEnum::ICON_MEDIA->value,
            ]);
        }

        if (!empty($unassignIds)) {
            Media::whereIn('id', $unassignIds)->update([
                'model_type' => Book::class,
                'model_id'   => 0,
            ]);
        }

        return [
            'assigned_ids'   => $assignIds,
            'unassigned_ids' => $unassignIds,
        ];
    }

    public static function validateBook(int $bookId): Book
    {
        $book = Book::findOrFail($bookId);
        $user = request()->user();
        if (!$user->hasRole(RoleEnum::ADMIN->value)) {
            throw new \Exception(__('book.validation_permission_denied'), HttpResponse::HTTP_FORBIDDEN);
        }

        $book->is_valid = true;
        $book->save();

        return $book;
    }

    public static function invalidateBook(int $bookId): Book
    {
        $book = Book::findOrFail($bookId);
        $user = request()->user();
        if (!$user->hasRole(RoleEnum::ADMIN->value)) {
            throw new \Exception(__('book.validation_permission_denied'), HttpResponse::HTTP_FORBIDDEN);
        }

        $book->is_valid = false;
        $book->save();

        return $book;
    }

}