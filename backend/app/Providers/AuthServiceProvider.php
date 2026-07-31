<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Cache;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::before(function ($user, $ability) {
            return method_exists($user, 'hasRole') && $user->hasRole('admin') ? true : null;
        });

        /**
         * Gate: view-child
         * Detects the correct link (pivot vs parent_id vs relation) only once per process.
         */
        Gate::define('view-child', function ($user, $childId) {
            static $strategy = null;

            if ($strategy === null) {
                if (Schema::hasTable('parent_children')) {
                    $strategy = 'pivot';
                } elseif (Schema::hasColumn('users', 'parent_id')) {
                    $strategy = 'parent_id';
                } elseif (method_exists($user, 'parentProfile')) {
                    $strategy = 'relation';
                } else {
                    $strategy = 'none';
                }
            }

            $cacheKey = "parent_child_access:{$user->id}:{$childId}";

            return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($strategy, $user, $childId) {
                switch ($strategy) {
                    case 'pivot':
                        return DB::table('parent_children')
                            ->where('parent_id', $user->id)
                            ->where('child_id', $childId)
                            ->exists();

                    case 'parent_id':
                        return DB::table('users')
                            ->where('id', $childId)
                            ->where('parent_id', $user->id)
                            ->exists();

                    case 'relation':
                        $profile = $user->parentProfile ?? null;
                        if (!$profile || !method_exists($profile, 'children')) {
                            return false;
                        }
                        return $profile->children()->where('user_id', $childId)->exists();

                    default:
                        return false;
                }
            });
        });
    }
}
