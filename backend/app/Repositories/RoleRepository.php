<?php

namespace App\Repositories;

use App\Enum\RoleEnum;
use App\Helpers\QueryConfig;
use App\Models\Role as ModelsRole;
use App\Models\User;
use App\Traits\PaginationParams;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleRepository
{
    use PaginationParams;

    /**
     * Get all roles with filtering, sorting, and pagination.
     *
     * @param QueryConfig $queryConfig
     * @return LengthAwarePaginator|Collection
     */
    public static function index(QueryConfig $queryConfig): LengthAwarePaginator|Collection
    {
        $query = ModelsRole::with('permissions')
            ->whereNotIn('name', [RoleEnum::CHILD->value, RoleEnum::PARENT->value]);

        ModelsRole::applyFilters($queryConfig->getFilters(), $query);

        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

        $roles = $queryConfig->getPaginated() ? $query->paginate($queryConfig->getPerPage()) : $query->get();

        return $roles;
    }
    public static function createWithPermissions(string $name, array $idsOrNames = []): Role
    {
        return DB::transaction(function () use ($name, $idsOrNames) {
            $role = Role::create(['name' => $name, 'guard_name' => 'api']);
            if (!empty($idsOrNames)) {
                $role->syncPermissions($idsOrNames);
            }
            return $role->load('permissions');
        });
    }

    public static function updateWithPermissions(Role $role, array $data, ?array $idsOrNames = null): Role
    {
        return DB::transaction(function () use ($role, $data, $idsOrNames) {
            if (array_key_exists('name', $data)) {
                $role->update(['name' => $data['name']]);
            }
            if (!is_null($idsOrNames)) {
                $role->syncPermissions($idsOrNames);
            }
            return $role->load('permissions');
        });
    }


    /**
     * Get a role by its ID.
     *
     * @param int $id
     * @return Role|null
     */
    public static function findById(int $id): ?Role
    {
        return Role::with('permissions')->find($id);
    }

    /**
     * Delete a role by its ID.
     *
     * @param int $id
     * @return bool|null
     */
    public static function delete(int $id): ?bool
    {
        $role = self::findById($id);
        if ($role) {
            return $role->delete();
        }
        return null;
    }
    /**
     * Assign role to user.
     * 
     * 
     */
    public static function assignRoleToUser(User $user,array $roleIds): User
    {
        $roles = Role::whereIn('id', $roleIds)->get();
        $user->syncRoles($roles);
        
        return $user->load('roles');
    }
    
}
