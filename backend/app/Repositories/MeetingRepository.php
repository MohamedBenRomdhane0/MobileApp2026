<?php

namespace App\Repositories;

use App\Enum\RoleEnum;
use App\Helpers\QueryConfig;
use App\Models\Meeting;
use App\Models\MeetingGroup;
use App\Models\MeetingTime;
use App\Models\User;
use App\Models\ChildProfile;
use Carbon\Carbon;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class MeetingRepository
{
    /**
     * Store meeting with groups and meeting times
     * @param array $data
     * @throws Exception
     * @return Meeting
     */
    public static function store(array $data): Meeting
    {
        $user = auth()->user();

        $isPrivate = $data['is_private'] ?? 0;

        $existingMeeting = Meeting::where('teacher_id', $user->id)
            ->where('level_id', $data['level_id'])
            ->where('material_id', $data['material_id'])
            ->where('is_private', $isPrivate)
            ->first();

        if ($existingMeeting) {
            $messageKey = $isPrivate 
                ? 'meeting.duplicate_private_meeting_exists' 
                : 'meeting.duplicate_public_meeting_exists';
            throw new Exception(__($messageKey));
        }

        $meeting = Meeting::create([
            'name' => $data['name'],
            'level_id' => $data['level_id'],
            'material_id' => $data['material_id'],
            'teacher_id' => $user->id,
            'is_private' => $data['is_private'] ?? 0,
            'max_students' => $data['max_students'] ?? null,
            'has_free_trial' => $data['has_free_trial'] ?? 1,
            'total_sessions' => $data['total_sessions'],
            'price' => $data['price'] ?? 0,
            'discount' => $data['discount'] ?? 0,
            'status' => $data['status'] ?? 'draft',
            'timezone' => $data['timezone'] ?? 'Africa/Tunis',
            'sessions_per_week' => $data['sessions_per_week'] ?? 1,
        ]);

        if (isset($data['meeting_groups'])) {
            foreach ($data['meeting_groups'] as $groupData) {
                self::addGroupToMeeting($meeting->id, $groupData);
            }
        }

        return $meeting->load(['level', 'material', 'teacher', 'meetingGroups.meetingTimes', 'meetingGroups.promos']);
    }

    /**
     * Index meetings with pagination
     * @param QueryConfig $queryConfig
     * @param User $user
     * @return Collection|\Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Database\Eloquent\Builder<Meeting>[]|\Illuminate\Database\Eloquent\Collection
     */
    public static function index(QueryConfig $queryConfig, User $user): LengthAwarePaginator|Collection
    {
        $query = Meeting::with(['level', 'material', 'teacher', 'meetingGroups.meetingTimes', 'meetingGroups.promos', 'meetingTimes'])->newQuery();

        if ($user->hasRole(RoleEnum::TEACHER->value)) {
            $query->where('teacher_id', $user->id);
        }

        Meeting::applyFilters($queryConfig->getFilters(), $query);

        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

        return $queryConfig->isPaginated()
            ? $query->paginate($queryConfig->getPerPage())
            : $query->get();
    }

    /**
     * Find a meeting by id
     * @param int $id
     * @return object|\Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model|\Illuminate\Database\Query\Builder|null
     */
    public static function findById(int $id): ?Meeting
    {
        return Meeting::where('id', $id)
            ->with(['level', 'material', 'teacher', 'meetingGroups.meetingTimes.media', 'meetingGroups.promos', 'meetingTimes.media'])
            ->first();
    }

    /**
     * Update a meeting
     * @param int $id
     * @param array $data
     * @return ?Meeting
     */
    public static function update(int $id, array $data): ?Meeting
    {
        $meeting = Meeting::find($id);

        if (!$meeting) {
            return throw new Exception(__('messages.meeting_not_found'));
        }

        $updateData = [];
        
        if (array_key_exists('name', $data)) {
            $updateData['name'] = $data['name'];
        }
        if (array_key_exists('is_private', $data)) {
            $updateData['is_private'] = $data['is_private'];
        }
        if (array_key_exists('max_students', $data)) {
            $updateData['max_students'] = $data['max_students'];
        }
        if (array_key_exists('has_free_trial', $data)) {
            $updateData['has_free_trial'] = $data['has_free_trial'];
        }
        if (array_key_exists('total_sessions', $data)) {
            $updateData['total_sessions'] = $data['total_sessions'];
        }
        if (array_key_exists('price', $data)) {
            $updateData['price'] = $data['price'];
        }
        if (array_key_exists('discount', $data)) {
            $updateData['discount'] = $data['discount'];
        }
        if (array_key_exists('status', $data)) {
            $updateData['status'] = $data['status'];
        }
        if (array_key_exists('sessions_per_week', $data)) {
            $updateData['sessions_per_week'] = $data['sessions_per_week'];
        }

        $meeting->update($updateData);

        return $meeting;
    }

    /**
     * Delete a meeting with its meeting groups and meering times
     * @param int $id
     * @return bool|int|mixed|null
     */
    public static function delete(int $id): bool
    {
        $meeting = Meeting::find($id);

        if (!$meeting) {
            return throw new Exception(__('messages.meeting_not_found'));
        }

        $meeting->meetingGroups()->each(function ($group) {
            $group->meetingTimes()->delete();
            $group->delete();
        });

        return $meeting->delete();
    }

    /**
     * Add a group to a meeting
     * @param int $meetingId
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model
     */
    public static function addGroupToMeeting(int $meetingId, array $data)
    {
        $meeting = Meeting::find($meetingId);

        if (!$meeting) {
            return throw new Exception(__('messages.meeting_not_found'));
        }

        $group = $meeting->meetingGroups()->create([
            'name'             => $data['name'],
            'max_students'     => $data['max_students'] ?? 1,
            'unit_price'       => $data['unit_price'] ?? 0,
            'net_price'        => $data['net_price'] ?? 0,
            'start_date'       => $data['start_date'] ?? null,
            'end_date'         => $data['end_date'] ?? null,
            'preset'           => $data['preset'] ?? null,
            'sessions_per_week' => $data['sessions_per_week'] ?? 1,
            'sessions_per_day'  => $data['sessions_per_day'] ?? 1,
        ]);

        if (!empty($data['meeting_times'])) {
            self::addSessionsToGroup($group->id, $data['meeting_times']);
        }

        if (!empty($data['promos'])) {
            self::addPromosToGroup($group->id, $data['promos']);
        }

        return $group->load(['meetingTimes', 'promos']);
    }

    /**
     * Create meeting times to a group
     * @param int $groupId
     * @param array $meetingTimes
     * @return \Illuminate\Database\Eloquent\Model[]
     */
    public static function addSessionsToGroup(int $groupId, array $meetingTimes)
    {
        $group = MeetingGroup::find($groupId);

        if (!$group) {
            return throw new Exception(__('messages.meeting_group_not_found'));
        }

        $meeting = $group->meeting;
        $sessions = [];

        foreach ($meetingTimes as $timeData) {
            self::checkTimeConflict(
                $meeting->teacher_id,
                $group->id,
                null,
                $timeData['meeting_date'],
                $timeData['start_time'],
                $timeData['end_time']
            );

            $sessions[] = $group->meetingTimes()->create([
                'meeting_date'      => $timeData['meeting_date'],
                'start_time'        => $timeData['start_time'],
                'end_time'          => $timeData['end_time'],
                'duration'          => $timeData['duration'] ?? null,
                'day_of_week'       => $timeData['day_of_week'] ?? null,
                'occurrence_in_day' => $timeData['occurrence_in_day'] ?? 1,
            ]);
        }

        return $sessions;
    }

    /**
     * Add promos to a group
     * @param int $groupId
     * @param array $promos
     * @return void
     */
    public static function addPromosToGroup(int $groupId, array $promos): void
    {
        $group = MeetingGroup::find($groupId);

        if (!$group) {
            throw new Exception(__('messages.meeting_group_not_found'));
        }

        foreach ($promos as $promo) {
            $group->promos()->create([
                'discount_template_id'  => $promo['discount_template_id'],
                'kind'                  => $promo['kind'],
                'discount_value'        => $promo['discount_value'],
                'condition_value'       => $promo['condition_value'] ?? null,
                'condition_unit'        => $promo['condition_unit'] ?? null,
                'condition_start_date'  => $promo['condition_start_date'] ?? null,
                'condition_end_date'    => $promo['condition_end_date'] ?? null,
            ]);
        }
    }

    /**
     * Update group
     * @param int $groupId
     * @param array $data
     * @return MeetingGroup
     */
    public static function updateGroup(int $groupId, array $data)
    {
        $group = MeetingGroup::find($groupId);

        if (!$group) {
            return throw new Exception(__('messages.meeting_group_not_found'));
        }

        $group->update([
            'name' => $data['name'],
        ]);

        return $group->load('meetingTimes');
    }

    /**
     * Delete group
     * @param int $groupId
     * @return bool|int|mixed|null
     */
    public static function deleteGroup(int $groupId): bool
    {
        $group = MeetingGroup::find($groupId);

        if (!$group) {
            return throw new Exception(__('messages.meeting_group_not_found'));
        }

        $group->meetingTimes()->delete();
        return $group->delete();
    }

    /**
     * Check if the times are conflicting
     * @param int $teacherId
     * @param int $groupId
     * @param mixed $excludeTimeId
     * @param string $date
     * @param string $startTime
     * @param string $endTime
     * @throws Exception
     * @return void
     */
    private static function checkTimeConflict(
        int $teacherId,
        int $groupId,
        ?int $excludeTimeId,
        string $date,
        string $startTime,
        string $endTime
    ): void {
        if ($startTime >= $endTime) {
            throw new Exception(__('messages.end_time_before_start_time'));
        }

        $conflictingTime = MeetingTime::where('group_id', $groupId)
            ->when($excludeTimeId, fn($q) => $q->where('id', '!=', $excludeTimeId))
            ->where('meeting_date', $date)
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where('start_time', '<', $endTime)
                      ->where('end_time', '>', $startTime);
            })
            ->first();

        if ($conflictingTime) {
            throw new Exception(__('messages.time_conflict'));
        }

        $teacherConflict = MeetingTime::whereHas('group.meeting', function ($query) use ($teacherId) {
                $query->where('teacher_id', $teacherId);
            })
            ->when($excludeTimeId, fn($q) => $q->where('id', '!=', $excludeTimeId))
            ->where('meeting_date', $date)
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where('start_time', '<', $endTime)
                      ->where('end_time', '>', $startTime);
            })
            ->first();

        if ($teacherConflict) {
            throw new Exception(__('meeting.teacher_conflict'));
        }
    }
    
    public static function updateMeetingTime(int $id, array $data): ?MeetingTime
    {
        $meetingTime = MeetingTime::find($id);

        if (!$meetingTime) {
            return throw new Exception(__('messages.meeting_time_not_found'));
        }

        $newDate = $data['meeting_date'] ?? $meetingTime->meeting_date;
        $newStartTime = $data['start_time'] ?? $meetingTime->start_time;
        $newEndTime = $data['end_time'] ?? $meetingTime->end_time;

        $teacherId = $meetingTime->group->meeting->teacher_id;

        self::checkTimeConflict(
            $teacherId,
            $meetingTime->group_id,
            $id,
            $newDate,
            $newStartTime,
            $newEndTime
        );

        $meetingTime->update([
            'meeting_date' => $newDate,
            'start_time' => $newStartTime,
            'end_time' => $newEndTime,
        ]);

        return $meetingTime;
    }

    public static function deleteMeetingTime(int $id): bool
    {
        $meetingTime = MeetingTime::find($id);

        if (!$meetingTime) {
            return throw new Exception(__('messages.meeting_time_not_found'));
        }

        return $meetingTime->delete();
    }

    public static function rescheduleMeetingTime(int $id, array $data): ?MeetingTime
    {
        $meetingTime = MeetingTime::find($id);

        if (!$meetingTime) {
            throw new Exception(__('messages.meeting_time_not_found'));
        }

        $teacherId = $meetingTime->group->meeting->teacher_id;

        self::checkTimeConflict(
            $teacherId,
            $meetingTime->group_id,
            $id,
            $data['meeting_date'],
            $data['start_time'],
            $data['end_time']
        );

        $meetingTime->update([
            'meeting_date'       => $data['meeting_date'],
            'start_time'         => $data['start_time'],
            'end_time'           => $data['end_time'],
            'status'             => 'rescheduled',
            'reschedule_details' => [
                'previous_date'       => $meetingTime->meeting_date,
                'previous_start_time' => $meetingTime->start_time,
                'previous_end_time'   => $meetingTime->end_time,
                'reason'              => $data['reason'] ?? null,
            ],
        ]);

        return $meetingTime->fresh();
    }

    public static function cancelMeetingTime(int $id, string $cancellationReason, ?string $cancellationComment = null): ?MeetingTime
    {
        $meetingTime = MeetingTime::find($id);

        if (!$meetingTime) {
            throw new Exception(__('messages.meeting_time_not_found'));
        }

        $meetingTime->update([
            'status'               => 'canceled',
            'cancellation_reason'  => $cancellationReason,
            'cancellation_comment' => $cancellationComment,
        ]);

        return $meetingTime->fresh();
    }

    public static function resetCanceledMeetingTime(int $id): ?MeetingTime
    {
        $meetingTime = MeetingTime::find($id);

        if (!$meetingTime) {
            throw new Exception(__('messages.meeting_time_not_found'));
        }

        if ($meetingTime->status !== 'canceled') {
            throw new Exception(__('messages.meeting_time_not_canceled'));
        }

        $meetingTime->update([
            'status' => 'active',
        ]);

        return $meetingTime->fresh();
    }

    public static function deleteUpcomingMeetingTimes(int $id): bool
    {
        $meetingTime = MeetingTime::find($id);

        if (!$meetingTime) {
            return throw new Exception(__('messages.meeting_time_not_found'));
        }

        return MeetingTime::where('group_id', $meetingTime->group_id)
            ->where(function ($query) use ($meetingTime) {
                $query->where('meeting_date', '>', $meetingTime->meeting_date)
                    ->orWhere(function ($q) use ($meetingTime) {
                        $q->where('meeting_date', $meetingTime->meeting_date)
                            ->where('start_time', '>=', $meetingTime->start_time);
                    });
            })
            ->delete();
    }

    /**
     * Index meetings for authenticated child
     * Only added for child space read access.
     *
     * @param QueryConfig $queryConfig
     * @param User $user
     * @return LengthAwarePaginator|Collection
     */
    public static function indexForChild(QueryConfig $queryConfig, User $user): LengthAwarePaginator|Collection
    {
        $childProfile = self::getChildProfileOrFail($user);

        $query = Meeting::query()
            ->with([
                'level',
                'material',
                'teacher',
                'meetingGroups.meetingTimes',
            ])
            ->where('status', 'published')
            ->where('is_private', false)
            ->where('level_id', $childProfile->level_id);

        Meeting::applyFilters($queryConfig->getFilters(), $query);

        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

        $meetings = $queryConfig->isPaginated()
            ? $query->paginate($queryConfig->getPerPage())
            : $query->get();

        if ($meetings instanceof LengthAwarePaginator) {
            $meetings->getCollection()->transform(
                fn (Meeting $meeting) => self::keepUpcomingMeetingTimes($meeting)
            );

            return $meetings;
        }

        return $meetings->map(
            fn (Meeting $meeting) => self::keepUpcomingMeetingTimes($meeting)
        );
    }

    /**
     * Find visible meeting details for authenticated child
     * Only added for child space read access.
     *
     * @param int $id
     * @param User $user
     * @return Meeting|null
     */
    public static function findByIdForChild(int $id, User $user): ?Meeting
    {
        $childProfile = self::getChildProfileOrFail($user);

        $meeting = Meeting::query()
            ->with([
                'level',
                'material',
                'teacher',
                'meetingGroups.meetingTimes',
            ])
            ->where('status', 'published')
            ->where('is_private', false)
            ->where('level_id', $childProfile->level_id)
            ->where('id', $id)
            ->first();

        if (!$meeting) {
            return null;
        }

        return self::keepUpcomingMeetingTimes($meeting);
    }

    /**
     * Index meetings for authenticated parent
     * Only added for parent space read access.
     *
     * @param QueryConfig $queryConfig
     * @param User $user
     * @return LengthAwarePaginator|Collection
     */
    public static function indexForParent(QueryConfig $queryConfig, User $user): LengthAwarePaginator|Collection
    {
        if (!$user->hasRole(RoleEnum::PARENT->value)) {
            throw new Exception(__('messages.unauthorized'));
        }

        $childProfile = $user->activeChild?->childProfile;

        if (!$childProfile || !$childProfile->level_id) {
            return $queryConfig->isPaginated()
                ? new LengthAwarePaginator([], 0, $queryConfig->getPerPage(), $queryConfig->getPage())
                : collect();
        }

        $query = Meeting::query()
            ->with([
                'level',
                'material',
                'teacher',
                'meetingGroups.meetingTimes',
            ])
            ->where('status', 'published')
            ->where('is_private', false)
            ->where('level_id', $childProfile->level_id);

        Meeting::applyFilters($queryConfig->getFilters(), $query);

        $query->orderBy($queryConfig->getOrderBy(), $queryConfig->getDirection());

        $meetings = $queryConfig->isPaginated()
            ? $query->paginate($queryConfig->getPerPage())
            : $query->get();

        if ($meetings instanceof LengthAwarePaginator) {
            $meetings->getCollection()->transform(
                fn (Meeting $meeting) => self::keepUpcomingMeetingTimes($meeting)
            );

            return $meetings;
        }

        return $meetings->map(
            fn (Meeting $meeting) => self::keepUpcomingMeetingTimes($meeting)
        );
    }

    /**
     * Find visible meeting details for authenticated parent
     * Only added for parent space read access.
     *
     * @param int $id
     * @param User $user
     * @return Meeting|null
     */
    public static function findByIdForParent(int $id, User $user): ?Meeting
    {
        if (!$user->hasRole(RoleEnum::PARENT->value)) {
            throw new Exception(__('messages.unauthorized'));
        }

        $childProfile = $user->activeChild?->childProfile;

        if (!$childProfile || !$childProfile->level_id) {
            return null;
        }

        $meeting = Meeting::query()
            ->with([
                'level',
                'material',
                'teacher',
                'meetingGroups.meetingTimes',
            ])
            ->where('status', 'published')
            ->where('is_private', false)
            ->where('level_id', $childProfile->level_id)
            ->where('id', $id)
            ->first();

        if (!$meeting) {
            return null;
        }

        return self::keepUpcomingMeetingTimes($meeting);
    }

    /**
     * Ensure authenticated user is a child and has a child profile with level
     *
     * @param User $user
     * @return ChildProfile
     */
    private static function getChildProfileOrFail(User $user): ChildProfile
    {
        if (!$user->hasRole(RoleEnum::CHILD->value)) {
            throw new Exception(__('messages.unauthorized'));
        }

        $childProfile = $user->childProfile()->first();

        if (!$childProfile) {
            throw new Exception(__('messages.child_profile_not_found'));
        }

        if (!$childProfile->level_id) {
            throw new Exception(__('messages.child_level_not_found'));
        }

        return $childProfile;
    }

    /**
     * Keep only upcoming sessions for each group
     *
     * @param Meeting $meeting
     * @return Meeting
     */
    private static function keepUpcomingMeetingTimes(Meeting $meeting): Meeting
    {
        $today = Carbon::today()->toDateString();
        $nowTime = Carbon::now()->format('H:i:s');

        $filteredGroups = $meeting->meetingGroups
            ->map(function (MeetingGroup $group) use ($today, $nowTime) {
                $upcomingTimes = $group->meetingTimes
                    ->filter(function (MeetingTime $meetingTime) use ($today, $nowTime) {
                        if ($meetingTime->meeting_date > $today) {
                            return true;
                        }

                        if ($meetingTime->meeting_date === $today) {
                            return $meetingTime->end_time >= $nowTime;
                        }

                        return false;
                    })
                    ->sortBy(function (MeetingTime $meetingTime) {
                        return sprintf('%s %s', $meetingTime->meeting_date, $meetingTime->start_time);
                    })
                    ->values();

                $group->setRelation('meetingTimes', $upcomingTimes);

                return $group;
            })
            ->filter(function (MeetingGroup $group) {
                return $group->meetingTimes->isNotEmpty();
            })
            ->values();

        $meeting->setRelation('meetingGroups', $filteredGroups);

        return $meeting;
    }
}