<?php

namespace App\Repositories;

use App\Enum\RoleEnum;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatsRepository
{
    public static function getUserRegistrationStats(string $startDate, string $endDate, string $groupBy = 'day', string $userType = 'all'): array
    {
        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        if ($groupBy === 'month') {
            $dateFormat = '%Y-%m';
            $groupFormat = 'Y-m';
        } else {
            $dateFormat = '%Y-%m-%d';
            $groupFormat = 'Y-m-d';
        }

        $roleTypes = self::getRoleTypesForFilter($userType);
        $stats = [];

        foreach ($roleTypes as $roleKey => $roleName) {
            $roleId = DB::table('roles')->where('name', $roleName)->value('id');

            $totalQuery = User::whereHas('roles', function ($q) use ($roleId) {
                $q->where('roles.id', $roleId);
            })->whereBetween('created_at', [$start, $end]);

            $totalCount = $totalQuery->count();

            $series = User::selectRaw("DATE_FORMAT(created_at, '{$dateFormat}') as period, COUNT(*) as count")
                ->whereHas('roles', function ($q) use ($roleId) {
                    $q->where('roles.id', $roleId);
                })
                ->whereBetween('created_at', [$start, $end])
                ->groupBy('period')
                ->orderBy('period')
                ->get()
                ->map(function ($item) {
                    return [
                        'date' => $item->period,
                        'count' => (int) $item->count,
                    ];
                });

            $filledSeries = self::fillMissingDates($series->toArray(), $start, $end, $groupBy);

            $stats[$roleKey] = [
                'total' => $totalCount,
                'series' => $filledSeries,
            ];
        }

        return $stats;
    }

    private static function getRoleTypesForFilter(string $userType): array
    {
        if ($userType === 'all') {
            return [
                'parents' => RoleEnum::PARENT->value,
                'children' => RoleEnum::CHILD->value,
                'teachers' => RoleEnum::TEACHER->value,
            ];
        }

        $roleMap = [
            'parent' => ['parents' => RoleEnum::PARENT->value],
            'child' => ['children' => RoleEnum::CHILD->value],
            'teacher' => ['teachers' => RoleEnum::TEACHER->value],
        ];

        return $roleMap[$userType] ?? [];
    }

    private static function fillMissingDates(array $series, Carbon $start, Carbon $end, string $groupBy): array
    {
        $filled = [];
        $seriesMap = collect($series)->keyBy('date');

        $current = $start->copy();
        $format = $groupBy === 'month' ? 'Y-m' : 'Y-m-d';
        $increment = $groupBy === 'month' ? 'month' : 'day';

        while ($current->lte($end)) {
            $dateKey = $current->format($format);
            $filled[] = $seriesMap->get($dateKey, [
                'date' => $dateKey,
                'count' => 0,
            ]);
            $current->add(1, $increment);
        }

        return $filled;
    }
}
