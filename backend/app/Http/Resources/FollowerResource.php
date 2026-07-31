<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FollowerResource extends JsonResource
{
    public function toArray($request): array
    {
        $avatar = null;

        if ($this->relationLoaded('media') && $this->media && $this->media->count() > 0) {
            $m = $this->media->first();
            $avatar = $m->full_url ?? $m->file_path ?? null;
        }

        return [
            'id'        => (int) $this->id,
            'full_name' => (string) $this->full_name,
            'level_id'  => (int) optional($this->childProfile)->level_id,
            'avatar'    => $avatar,
        ];
    }
}
