<?php
namespace Database\Factories;

use App\Enum\TypeEnum;
use App\Models\Book;
use App\Models\User;
use App\Models\LevelMaterial;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition(): array
    {
        return [
            'level_material_id' => 1,
            'title' => $this->faker->sentence(3),
            'type' => TypeEnum::MANUAL->value,
            'user_id' => User::factory(),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
}
