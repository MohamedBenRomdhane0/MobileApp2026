<?php

namespace App\Http\Controllers\Api\Plan;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\Book;
use App\Models\Material;
use App\Models\LevelMaterial;
use App\Traits\SuccessResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;
use OpenApi\Annotations as OA;

class GetAvailableEntitiesController extends Controller
{
    use SuccessResponse;

    /**
     * @OA\Get(
     *     path="/api/admin/plan-accessible-entities/available",
     *     tags={"Plan"},
     *     summary="Get all available entities",
     *     description="Returns all available entities grouped by type (Courses, Quizzes, Books, Materials, LevelMaterials) that can be assigned to plans.",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Available entities retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Success"),
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="type", type="string", example="Course", description="Entity type"),
     *                     @OA\Property(property="label", type="string", example="Courses", description="Human-readable label"),
     *                     @OA\Property(property="items", type="array",
     *                         @OA\Items(
     *                             @OA\Property(property="id", type="integer", example=1),
     *                             @OA\Property(property="title", type="string", example="Mathematics Course"),
     *                             @OA\Property(property="type", type="string", example="Course"),
     *                             @OA\Property(property="level_material", type="object", nullable=true,
     *                                 @OA\Property(property="material", type="string", example="Mathematics"),
     *                                 @OA\Property(property="level", type="string", example="Grade 10")
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(@OA\Property(property="message", type="string", example="Error retrieving entities"))
     *     )
     * )
     */
    public function __invoke(): JsonResponse
    {
        $availableEntities = [
            [
                'type' => 'Course',
                'label' => 'Courses',
                'model' => Course::class,
                'items' => Course::with('levelMaterial.material', 'levelMaterial.level')
                    ->get()
                    ->map(fn($course) => [
                        'id' => $course->id,
                        'title' => $course->title,
                        'type' => 'Course',
                        'level_material' => $course->levelMaterial ? [
                            'material' => $course->levelMaterial->material->name ?? null,
                            'level' => $course->levelMaterial->level->name ?? null,
                        ] : null,
                    ]),
            ],
            [
                'type' => 'Quiz',
                'label' => 'Quizzes',
                'model' => Quiz::class,
                'items' => Quiz::with('levelMaterial.material', 'levelMaterial.level')
                    ->get()
                    ->map(fn($quiz) => [
                        'id' => $quiz->id,
                        'title' => $quiz->title,
                        'type' => 'Quiz',
                        'level_material' => $quiz->levelMaterial ? [
                            'material' => $quiz->levelMaterial->material->name ?? null,
                            'level' => $quiz->levelMaterial->level->name ?? null,
                        ] : null,
                    ]),
            ],
            [
                'type' => 'Book',
                'label' => 'Books',
                'model' => Book::class,
                'items' => Book::with('levelMaterial.material', 'levelMaterial.level')
                    ->get()
                    ->map(fn($book) => [
                        'id' => $book->id,
                        'title' => $book->title,
                        'type' => 'Book',
                        'level_material' => $book->levelMaterial ? [
                            'material' => $book->levelMaterial->material->name ?? null,
                            'level' => $book->levelMaterial->level->name ?? null,
                        ] : null,
                    ]),
            ],
            [
                'type' => 'Material',
                'label' => 'Materials',
                'model' => Material::class,
                'items' => Material::all()->map(fn($material) => [
                    'id' => $material->id,
                    'title' => $material->name,
                    'type' => 'Material',
                ]),
            ],
            [
                'type' => 'LevelMaterial',
                'label' => 'Level Materials',
                'model' => LevelMaterial::class,
                'items' => LevelMaterial::with('material', 'level')
                    ->get()
                    ->map(fn($lm) => [
                        'id' => $lm->id,
                        'title' => ($lm->level->name ?? '') . ' - ' . ($lm->material->name ?? ''),
                        'type' => 'LevelMaterial',
                        'material' => $lm->material->name ?? null,
                        'level' => $lm->level->name ?? null,
                    ]),
            ],
        ];

        return $this->returnSuccessResponse(
            __('messages.success'),
            $availableEntities,
            ResponseAlias::HTTP_OK
        );
    }
}
