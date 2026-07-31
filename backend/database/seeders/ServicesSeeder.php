<?php

namespace Database\Seeders;

use App\Enum\ServiceEnum;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServicesSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'slug'     => ServiceEnum::BOOKS->value,
                'name'     => ServiceEnum::BOOKS->label(),
                'icon'     => ServiceEnum::BOOKS->icon(),
                'color'    => '#7C3AED',
                'level_ids' => null,
                'is_active' => true,
                'order'    => ServiceEnum::BOOKS->order(),
            ],
            [
                'slug'     => ServiceEnum::EXTRA_COURSES->value,
                'name'     => ServiceEnum::EXTRA_COURSES->label(),
                'icon'     => ServiceEnum::EXTRA_COURSES->icon(),
                'color'    => '#06B6D4',
                'level_ids' => null,
                'is_active' => true,
                'order'    => ServiceEnum::EXTRA_COURSES->order(),
            ],
            [
                'slug'     => ServiceEnum::LIVE_MEETINGS->value,
                'name'     => ServiceEnum::LIVE_MEETINGS->label(),
                'icon'     => ServiceEnum::LIVE_MEETINGS->icon(),
                'color'    => '#F97316',
                'level_ids' => null,
                'is_active' => true,
                'order'    => ServiceEnum::LIVE_MEETINGS->order(),
            ],
            [
                'slug'     => ServiceEnum::QUIZZES->value,
                'name'     => ServiceEnum::QUIZZES->label(),
                'icon'     => ServiceEnum::QUIZZES->icon(),
                'color'    => '#EAB308',
                'level_ids' => null,
                'is_active' => true,
                'order'    => ServiceEnum::QUIZZES->order(),
            ],
            [
                'slug'     => ServiceEnum::EXERCISES->value,
                'name'     => ServiceEnum::EXERCISES->label(),
                'icon'     => ServiceEnum::EXERCISES->icon(),
                'color'    => '#22C55E',
                'level_ids' => null,
                'is_active' => true,
                'order'    => ServiceEnum::EXERCISES->order(),
            ],
            [
                'slug'     => ServiceEnum::CONCOURS->value,
                'name'     => ServiceEnum::CONCOURS->label(),
                'icon'     => ServiceEnum::CONCOURS->icon(),
                'color'    => '#EC4899',
                'level_ids' => null,
                'is_active' => true,
                'order'    => ServiceEnum::CONCOURS->order(),
            ],
            [
                'slug'     => ServiceEnum::TEACHER_BOOKS->value,
                'name'     => ServiceEnum::TEACHER_BOOKS->label(),
                'icon'     => ServiceEnum::TEACHER_BOOKS->icon(),
                'color'    => '#3B82F6',
                'level_ids' => null,
                'is_active' => true,
                'order'    => ServiceEnum::TEACHER_BOOKS->order(),
            ],
        ];

        foreach ($services as $data) {
            Service::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
