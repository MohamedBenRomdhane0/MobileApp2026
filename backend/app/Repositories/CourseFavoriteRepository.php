<?php

namespace App\Repositories;

use App\Helpers\QueryConfig;
use App\Models\User;
use App\Traits\PaginationParams;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CourseFavoriteRepository
{
    use PaginationParams;

    public static function toggle(User $user, int $courseId): bool
    {
        $result = $user->favoriteCourses()->toggle([$courseId]);

        return !empty($result['attached']);
    }

    public static function index(User $user, QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $query = $user->favoriteCourses()
            ->with([
                'level',
                'material',
                'media',
            ])
            ->orderBy(
                $queryConfig->getOrderBy(),
                $queryConfig->getDirection()
            );

        return $queryConfig->getPaginated()
            ? $query->paginate($queryConfig->getPerPage())
            : $query->get();
    }
}
