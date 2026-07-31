<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *   title="Abajim API",
 *   version="1.0.0",
 *   description="API for Abajim application handling user registrations, authentication, dashboards, and more.",
 *   @OA\Contact(
 *     email="contact@abajim.com"
 *   )
 * )
 *
 * @OA\Server(
 *   url="/",
 *   description="Laravel application root (API routes are under /api)"
 * )
 *
 * @OA\SecurityScheme(
 *   securityScheme="bearerAuth",
 *   type="http",
 *   scheme="bearer",
 *   bearerFormat="JWT"
 * )
 *
 * @OA\SecurityRequirement(
 *   security={"bearerAuth": {}}
 * )
 *
 * @OA\Tag(
 *   name="ParentDashboard",
 *   description="Child activity & parent dashboard KPIs"
 * )
 *
 * @OA\Schema(
 *   schema="DailyActivityPoint",
 *   type="object",
 *   @OA\Property(property="day", type="string", example="2025-11-10"),
 *   @OA\Property(property="actions", type="integer", example=7)
 * )
 *
 * @OA\Schema(
 *   schema="ParentDashboardResponse",
 *   type="object",
 *   @OA\Property(property="total_videos", type="integer", example=12),
 *   @OA\Property(property="total_minutes", type="integer", example=145),
 *   @OA\Property(property="total_books", type="integer", example=5),
 *   @OA\Property(property="total_webinars", type="integer", example=2),
 *   @OA\Property(property="total_meetings", type="integer", example=1),
 *   @OA\Property(property="most_recent_activity", type="string", format="date-time", example="2025-11-13T10:31:00Z"),
 *   @OA\Property(property="days_active_this_week", type="integer", example=4),
 *   @OA\Property(property="average_session_duration", type="integer", example=120),
 *   @OA\Property(property="video_completion_rate", type="integer", example=62),
 *   @OA\Property(
 *     property="daily_activity",
 *     type="array",
 *     @OA\Items(ref="#/components/schemas/DailyActivityPoint")
 *   ),
 *   @OA\Property(property="most_frequent_action_type", type="string", example="video"),
 *   @OA\Property(
 *     property="navigation",
 *     type="array",
 *     @OA\Items(
 *       type="object",
 *       @OA\Property(property="screen_name", type="string", example="ParentDashboardScreen"),
 *       @OA\Property(property="created_at", type="string", format="date-time")
 *     )
 *   ),
 *   @OA\Property(
 *     property="books",
 *     type="array",
 *     @OA\Items(
 *       type="object",
 *       @OA\Property(property="reference_id", type="integer", example=55),
 *       @OA\Property(property="book_title", type="string", example="كتاب العربية 5ème"),
 *       @OA\Property(property="created_at", type="string", format="date-time")
 *     )
 *   ),
 *   @OA\Property(
 *     property="webinars",
 *     type="array",
 *     @OA\Items(
 *       type="object",
 *       @OA\Property(property="reference_id", type="integer", example=99),
 *       @OA\Property(property="webinar_title", type="string", example="Lecture & Compréhension"),
 *       @OA\Property(property="created_at", type="string", format="date-time")
 *     )
 *   ),
 *   @OA\Property(
 *     property="meetings",
 *     type="array",
 *     @OA\Items(
 *       type="object",
 *       @OA\Property(property="reference_id", type="integer", example=77),
 *       @OA\Property(property="meeting_title", type="string", example="لقاء مع حبيب بوفارس"),
 *       @OA\Property(property="created_at", type="string", format="date-time")
 *     )
 *   ),
 *   @OA\Property(
 *     property="videos",
 *     type="array",
 *     @OA\Items(
 *       type="object",
 *       @OA\Property(property="reference_id", type="integer", example=33),
 *       @OA\Property(property="video_title", type="string", example="Révision: fractions"),
 *       @OA\Property(property="created_at", type="string", format="date-time")
 *     )
 *   ),
 *   @OA\Property(property="weekly_activity_count", type="integer", example=23),
 *   @OA\Property(property="monthly_activity_count", type="integer", example=88),
 *   @OA\Property(
 *     property="weekly_video_goal",
 *     type="object",
 *     @OA\Property(property="goal", type="integer", example=5),
 *     @OA\Property(property="achieved", type="integer", example=3),
 *     @OA\Property(property="progress_percent", type="integer", example=60)
 *   ),
 *   @OA\Property(property="alert_inactive_days", type="integer", nullable=true, example=4),
 *   @OA\Property(property="global_average_activity", type="integer", example=6),
 *   @OA\Property(property="child_total_activity", type="integer", example=120)
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
