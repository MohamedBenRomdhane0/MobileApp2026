<?php

namespace App\Repositories;

use App\Enum\MediaTagEnum;
use App\Models\Book;
use App\Models\BookIcon;
use App\Models\BookModule;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookModuleRepository
{
    /**
     * Get all modules for a book, each with per-module progress for the authenticated teacher.
     */
    public static function index(Book $book): Collection
    {
        $user  = Auth::user();
        $userId = $user->id;

        $modules = BookModule::where('book_id', $book->id)
            ->orderBy('order')
            ->get();

        $modules->transform(function (BookModule $module) use ($book, $userId) {
            $progress = self::calcProgress($book->id, $module->start_page, $module->end_page, $userId);
            $total = $progress[0] ?? 0;
            $filled = $progress[1] ?? 0;
            $pending = $progress[2] ?? 0;
            $module->icons_total   = $total;
            $module->icons_filled  = $filled;
            $module->icons_pending = $pending;
            $module->progress      = $total > 0 ? round(($filled / $total) * 100) : 0;
            return $module;
        });

        return $modules;
    }

    /**
     * Create a new module for a book.
     */
    public static function store(Book $book, array $data): BookModule
    {
        $maxOrder = BookModule::where('book_id', $book->id)->max('order') ?? -1;

        return BookModule::create([
            'book_id'    => $book->id,
            'title'      => $data['title'],
            'start_page' => $data['start_page'],
            'end_page'   => $data['end_page'],
            'order'      => $data['order'] ?? ($maxOrder + 1),
        ]);
    }

    /**
     * Update an existing module.
     */
    public static function update(BookModule $module, array $data): BookModule
    {
        $fields = array_filter([
            'start_page' => $data['start_page'] ?? null,
            'end_page'   => $data['end_page'] ?? null,
            'order'      => $data['order'] ?? null,
        ], fn ($v) => $v !== null);

        if (array_key_exists('title', $data)) {
            $fields['title'] = $data['title'];
        }

        $module->update($fields);

        return $module->fresh();
    }

    /**
     * Delete a module.
     */
    public static function destroy(BookModule $module): void
    {
        $module->delete();
    }

    /**
     * Get modules with progress for a collection of books.
     */
    public static function getModulesWithProgressForBooks(array $bookIds, int $userId): array
    {
        if (empty($bookIds)) {
            return [];
        }

        $modules = BookModule::whereIn('book_id', $bookIds)
            ->orderBy('order')
            ->get(['id', 'book_id', 'title', 'start_page', 'end_page', 'order']);

        if ($modules->isEmpty()) {
            return [];
        }

        $moduleIds = $modules->pluck('id')->toArray();
        $totalsRaw = DB::table('book_icons')
            ->join('book_modules', function ($join) {
                $join->on('book_icons.book_id', '=', 'book_modules.book_id')
                     ->whereRaw('CAST(SUBSTRING_INDEX(book_icons.page, \'-\', -1) AS UNSIGNED) >= book_modules.start_page')
                     ->whereRaw('CAST(SUBSTRING_INDEX(book_icons.page, \'-\', -1) AS UNSIGNED) <= book_modules.end_page');
            })
            ->whereIn('book_modules.id', $moduleIds)
            ->whereNull('book_icons.deleted_at')
            ->whereNull('book_modules.deleted_at')
            ->groupBy('book_modules.id')
            ->select('book_modules.id as module_id', DB::raw('COUNT(book_icons.id) as total'))
            ->get()
            ->keyBy('module_id');

        $filledRaw = DB::table('book_icons')
            ->join('book_modules', function ($join) {
                $join->on('book_icons.book_id', '=', 'book_modules.book_id')
                     ->whereRaw('CAST(SUBSTRING_INDEX(book_icons.page, \'-\', -1) AS UNSIGNED) >= book_modules.start_page')
                     ->whereRaw('CAST(SUBSTRING_INDEX(book_icons.page, \'-\', -1) AS UNSIGNED) <= book_modules.end_page');
            })
            ->join('media', function ($join) use ($userId) {
                $join->on('media.model_id', '=', 'book_icons.id')
                     ->where('media.model_type', '=', BookIcon::class)
                     ->where('media.tag', '=', MediaTagEnum::ICON_MEDIA->value)
                     ->where('media.creator_id', '=', $userId)
                     ->where('media.is_active', '=', true)
                     ->whereNull('media.deleted_at');
            })
            ->whereIn('book_modules.id', $moduleIds)
            ->whereNull('book_icons.deleted_at')
            ->whereNull('book_modules.deleted_at')
            ->groupBy('book_modules.id')
            ->select('book_modules.id as module_id', DB::raw('COUNT(DISTINCT book_icons.id) as filled'))
            ->get()
            ->keyBy('module_id');

        $pendingRaw = DB::table('book_icons')
            ->join('book_modules', function ($join) {
                $join->on('book_icons.book_id', '=', 'book_modules.book_id')
                     ->whereRaw('CAST(SUBSTRING_INDEX(book_icons.page, \'-\', -1) AS UNSIGNED) >= book_modules.start_page')
                     ->whereRaw('CAST(SUBSTRING_INDEX(book_icons.page, \'-\', -1) AS UNSIGNED) <= book_modules.end_page');
            })
            ->join('media', function ($join) use ($userId) {
                $join->on('media.model_id', '=', 'book_icons.id')
                     ->where('media.model_type', '=', BookIcon::class)
                     ->where('media.tag', '=', MediaTagEnum::ICON_MEDIA->value)
                     ->where('media.creator_id', '=', $userId)
                     ->where('media.is_active', '=', false)
                     ->whereNull('media.deleted_at');
            })
            ->whereIn('book_modules.id', $moduleIds)
            ->whereNull('book_icons.deleted_at')
            ->whereNull('book_modules.deleted_at')
            ->groupBy('book_modules.id')
            ->select('book_modules.id as module_id', DB::raw('COUNT(DISTINCT book_icons.id) as pending'))
            ->get()
            ->keyBy('module_id');

        $grouped = [];
        foreach ($modules as $module) {
            $total   = (int) ($totalsRaw->get($module->id)->total   ?? 0);
            $filled  = (int) ($filledRaw->get($module->id)->filled  ?? 0);
            $pending = (int) ($pendingRaw->get($module->id)->pending ?? 0);

            $grouped[$module->book_id][] = [
                'id'            => $module->id,
                'book_id'       => $module->book_id,
                'title'         => $module->title,
                'start_page'    => $module->start_page,
                'end_page'      => $module->end_page,
                'order'         => $module->order,
                'icons_total'   => $total,
                'icons_filled'  => $filled,
                'icons_pending' => $pending,
                'progress'      => $total > 0 ? round(($filled / $total) * 100) : 0,
            ];
        }

        return $grouped;
    }

    /**
     * Calculate progress for a single module by page range.
     *
     * @return array{0: int, 1: int, 2: int} [total, filled (active), pending (inactive)]
     */
    private static function calcProgress(int $bookId, int $startPage, int $endPage, int $userId): array
    {
        $total = BookIcon::where('book_id', $bookId)
            ->whereRaw('CAST(SUBSTRING_INDEX(`page`, \'-\', -1) AS UNSIGNED) >= ?', [$startPage])
            ->whereRaw('CAST(SUBSTRING_INDEX(`page`, \'-\', -1) AS UNSIGNED) <= ?', [$endPage])
            ->count();

        $filled = BookIcon::where('book_id', $bookId)
            ->whereRaw('CAST(SUBSTRING_INDEX(`page`, \'-\', -1) AS UNSIGNED) >= ?', [$startPage])
            ->whereRaw('CAST(SUBSTRING_INDEX(`page`, \'-\', -1) AS UNSIGNED) <= ?', [$endPage])
            ->whereHas('media', function ($q) use ($userId) {
                $q->where('tag', MediaTagEnum::ICON_MEDIA->value)
                  ->where('creator_id', $userId)
                  ->where('is_active', true);
            })
            ->count();

        $pending = BookIcon::where('book_id', $bookId)
            ->whereRaw('CAST(SUBSTRING_INDEX(`page`, \'-\', -1) AS UNSIGNED) >= ?', [$startPage])
            ->whereRaw('CAST(SUBSTRING_INDEX(`page`, \'-\', -1) AS UNSIGNED) <= ?', [$endPage])
            ->whereHas('media', function ($q) use ($userId) {
                $q->where('tag', MediaTagEnum::ICON_MEDIA->value)
                  ->where('creator_id', $userId)
                  ->where('is_active', false);
            })
            ->count();

        return [$total, $filled, $pending];
    }
}
