<?php
namespace Database\Factories;

use App\Enum\IconTypeEnum;
use App\Models\BookIcon;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookIconFactory extends Factory
{
    protected $model = BookIcon::class;

    public function definition(): array
    {
        return [
            'book_id' => \App\Models\Book::factory(),
            'page' => 1,
            'x' => 100,
            'y' => 200,
            'icon_type' => IconTypeEnum::VIDEO->value,
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
}
