<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;
use App\Traits\ApplyQueryScopes;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Role",
 *     type="object",
 *     title="Role",
 *     required={"id", "name"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="admin"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 * )
 */

class Role extends SpatieRole
{
    use ApplyQueryScopes;

    protected $hidden = ['created_at', 'updated_at', 'pivot', 'guard_name'];

    public function scopeByKeyword($query, $keyword)
    {
        return $query->where('name', 'like', '%' . $keyword . '%');
    }
}

