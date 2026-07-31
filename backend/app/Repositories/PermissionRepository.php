<?php

namespace App\Repositories;

use App\Helpers\QueryConfig;
use App\Models\Permission;
use App\Traits\PaginationParams;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PermissionRepository
{
    use PaginationParams;

    public static function index(QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $query = Permission::query();

        Permission::applyFilters($queryConfig->getFilters(), $query);

        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());
        $permissions =  $queryConfig->getPaginated() ? $query->paginate($queryConfig->getPerPage()) : $query->get();

        return $permissions;
    }
}
