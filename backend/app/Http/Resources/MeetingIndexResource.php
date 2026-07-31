<?php

namespace App\Http\Resources;

use App\Models\MeetingGroup;
use App\Models\MeetingTime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class MeetingIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        $price = (float) ($this->price ?? 0);
        $discount = (float) ($this->discount ?? 0);
        $allTimes = $this->getAllMeetingTimes();
        $nextSession = $allTimes->first();

        $data = parent::toArray($request);

        unset($data['meeting_groups'], $data['meeting_times']);

        $data['final_price'] = max($price - $discount, 0);
        $data['has_discount'] = $discount > 0;
        $data['groups_count'] = $this->resource->relationLoaded('meetingGroups')
            ? $this->meetingGroups->count()
            : 0;
        $data['upcoming_sessions_count'] = $allTimes->count();
        $data['next_session_at'] = $nextSession
            ? "{$nextSession->meeting_date} {$nextSession->start_time}"
            : null;

        return $data;
    }

    /**
     * @return Collection
     */
    private function getAllMeetingTimes(): Collection
    {
        if (!$this->resource->relationLoaded('meetingGroups')) {
            return collect();
        }

        return $this->meetingGroups
            ->flatMap(function (MeetingGroup $group) {
                return $group->meetingTimes;
            })
            ->sortBy(function (MeetingTime $meetingTime) {
                return sprintf('%s %s', $meetingTime->meeting_date, $meetingTime->start_time);
            })
            ->values();
    }
}