<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;
use App\Traits\ApplyQueryScopes;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Permission",
 *     type="object",
 *     title="Permission",
 *     required={"id", "name"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="edit articles"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 * )
 */

class Permission extends SpatiePermission
{
    use ApplyQueryScopes;

    protected $hidden = ['created_at', 'updated_at', 'pivot', 'guard_name'];

    public function scopeByKeyword($query, $keyword)
    {
        return $query->where('name', 'like', '%' . $keyword . '%');
    }
}

