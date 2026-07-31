<?php

use App\Enum\PermissionsEnum;
use App\Http\Controllers\Api\Auth\AdminLoginController;
use App\Http\Controllers\Api\Admin\DeleteChildController as AdminDeleteChildController;
use App\Http\Controllers\Api\Admin\GetParentRegistrationStatsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

// ---------- Auth ----------
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\ParentLoginController;
use App\Http\Controllers\Api\Auth\RegisterParentController;
use App\Http\Controllers\Api\Auth\RegisterTeacherController;
use App\Http\Controllers\Api\Auth\VerifyCodeController;
use App\Http\Controllers\Api\Auth\SendResetCodeController;
use App\Http\Controllers\Api\Auth\ResendVerificationCodeController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\Auth\RefreshTokenController;
use App\Http\Controllers\Api\Auth\SwitchToParentController;
use App\Http\Controllers\Api\Auth\SwitchToChildController;
use App\Http\Controllers\Api\Auth\CreateChildController;

// ---------- Users / Roles / Permissions ----------
use App\Http\Controllers\Api\Role\IndexRoleController;
use App\Http\Controllers\Api\Role\StoreRoleController;
use App\Http\Controllers\Api\Role\GetRoleByIdController;
use App\Http\Controllers\Api\Role\UpdateRoleController;
use App\Http\Controllers\Api\Role\DeleteRoleController;
use App\Http\Controllers\Api\Role\AssignRoleToUserController;
use App\Http\Controllers\Api\Permission\IndexPermissionController;
use App\Http\Controllers\Api\Permission\GetGroupedPermissionsController;
use App\Http\Controllers\Api\User\IndexTeachersController;
use App\Http\Controllers\Api\User\DeleteChildController;

use App\Http\Controllers\Api\User\CreateParentController;

// ---------- Levels / Materials ----------
use App\Http\Controllers\Api\Level\CreateLevelController;
use App\Http\Controllers\Api\Level\DeleteLevelController;
use App\Http\Controllers\Api\Level\IndexLevelsController;
use App\Http\Controllers\Api\Level\UpdateLevelController;
use App\Http\Controllers\Api\Level\GetLevelMaterialsController;
use App\Http\Controllers\Api\Material\AssignMaterialsToLevelController;
use App\Http\Controllers\Api\Material\CreateMaterialController;
use App\Http\Controllers\Api\Material\DeleteMaterialController;
use App\Http\Controllers\Api\Material\IndexMaterialsController;
use App\Http\Controllers\Api\Material\UpdateMaterialController;
use App\Http\Controllers\Api\Level\ListLevelMaterialsByLevelController;

// ---------- CEO Settings ------------
use App\Http\Controllers\Api\Admin\GetCeoSettingController;
use App\Http\Controllers\Api\Admin\UpdateCeoSettingController;

// ---------- Services (Activation Matrix) ----------
use App\Http\Controllers\Api\Service\IndexServicesController;
use App\Http\Controllers\Api\Service\GetServicesForLevelController;
use App\Http\Controllers\Api\Service\ToggleLevelServiceController;
use App\Http\Controllers\Api\Service\ToggleLevelSectionServiceController;
use App\Http\Controllers\Api\Service\ToggleLevelSectionMaterialServiceController;
use App\Http\Controllers\Api\Service\ToggleLevelMaterialServiceController;
use App\Http\Controllers\Api\Service\UpdateServiceLevelRestrictionsController;

// ---------- Level Types / Sections ----------
use App\Http\Controllers\Api\LevelType\IndexLevelTypesController;
use App\Http\Controllers\Api\LevelType\StoreLevelTypeController;
use App\Http\Controllers\Api\LevelType\UpdateLevelTypeController;
use App\Http\Controllers\Api\LevelType\SaveCycleController;
use App\Http\Controllers\Api\LevelType\IndexLevelTypePeriodsController;
use App\Http\Controllers\Api\LevelType\StoreLevelTypePeriodController;
use App\Http\Controllers\Api\LevelType\UpdateLevelTypePeriodController;
use App\Http\Controllers\Api\LevelType\DeleteLevelTypePeriodController;
use App\Http\Controllers\Api\Section\IndexSectionsController;
use App\Http\Controllers\Api\Section\CreateSectionController;
use App\Http\Controllers\Api\Section\UpdateSectionController;
use App\Http\Controllers\Api\Section\DeleteSectionController;
use App\Http\Controllers\Api\Section\AssignMaterialsToLevelSectionController;
use App\Http\Controllers\Api\Section\AssignMaterialsToSectionController;
use App\Http\Controllers\Api\Section\SyncSectionsToLevelController;
use App\Http\Controllers\Api\Section\UpdateLevelSectionMaterialSharingGroupController;
// ---------- Plans ----------
use App\Http\Controllers\Api\Plan\IndexPlanController;
use App\Http\Controllers\Api\Plan\ShowPlanController;
use App\Http\Controllers\Api\Plan\StorePlanController;
use App\Http\Controllers\Api\Plan\UpdatePlanController;
use App\Http\Controllers\Api\Plan\DestroyPlanController;
use App\Http\Controllers\Api\Plan\DuplicatePlanController;

// ---------- Books ----------
use App\Http\Controllers\Api\Book\StoreBookController;
use App\Http\Controllers\Api\Book\UpdateBookController;
use App\Http\Controllers\Api\Book\DeleteBookController;
use App\Http\Controllers\Api\Book\IndexBooksController;
use App\Http\Controllers\Api\Book\GetBookByIdController;
use App\Http\Controllers\Api\Book\GetBookByIdForChildController;
use App\Http\Controllers\Api\Book\TrackBookOpenController;
use App\Http\Controllers\Api\Book\StoreBookIconsController;
use App\Http\Controllers\Api\Book\UpdateBookIconController;
use App\Http\Controllers\Api\Book\DeleteBookIconsController;
use App\Http\Controllers\Api\Book\DeleteIconWithMediaController;
use App\Http\Controllers\Api\Book\DeleteMediaController;
use App\Http\Controllers\Api\Book\CreateMediaMultipartUploadController;
use App\Http\Controllers\Api\Book\SignMediaMultipartUploadPartController;
use App\Http\Controllers\Api\Book\CompleteMediaMultipartUploadController;
use App\Http\Controllers\Api\Book\AbortMediaMultipartUploadController;
use App\Http\Controllers\Api\Book\CompleteIconMediaMultipartUploadController;
use App\Http\Controllers\Api\Book\GetIconByIdController;
use App\Http\Controllers\Api\Book\UploadMediaController;
use App\Http\Controllers\Api\Book\UploadIconMediaController;
use App\Http\Controllers\Api\Book\GetVideoProcessingStatusController;
use App\Http\Controllers\Api\Book\GetVideoTranscodingStatusController;
use App\Http\Controllers\Api\Book\GetBookVideoByIdController;
use App\Http\Controllers\Api\Book\SyncIconVideosController;
use App\Http\Controllers\Api\Book\SetBookLanguageController;
use App\Http\Controllers\Api\Book\IndexVideosForUserController;
use App\Http\Controllers\Api\Book\UpdateMediaController;
use App\Http\Controllers\Api\Book\IndexAdminBooksController;
use App\Http\Controllers\Api\Book\IndexTeacherBooksController;
use App\Http\Controllers\Api\Book\CreateBookDraftController;
use App\Http\Controllers\Api\Book\GetModuleIconsController;
use App\Http\Controllers\Api\Book\IndexBookModulesController;
use App\Http\Controllers\Api\Book\StoreBookModuleController;
use App\Http\Controllers\Api\Book\UpdateBookModuleController;
use App\Http\Controllers\Api\Book\DeleteBookModuleController;
use App\Http\Controllers\Api\Book\CreateBookPdfMultipartUploadController;
use App\Http\Controllers\Api\Book\SignBookPdfMultipartUploadPartController;
use App\Http\Controllers\Api\Book\CompleteBookPdfMultipartUploadController;
use App\Http\Controllers\Api\Book\AbortBookPdfMultipartUploadController;
use App\Http\Controllers\Api\Book\GetIconMediaPickerController;
use App\Http\Controllers\Api\Book\GetBatchIconStationContentController;
use App\Http\Controllers\Api\Book\GetIconStationContentController;
use App\Http\Controllers\Api\Child\TrackMediaViewController;

// ---------- Courses ----------
use App\Http\Controllers\Api\Course\StoreCourseController;
use App\Http\Controllers\Api\Course\UploadChapterVideoController;
use App\Http\Controllers\Api\Course\DeleteCourseController;
use App\Http\Controllers\Api\Course\IndexCoursesController;
use App\Http\Controllers\Api\Course\ShowCourseController;
use App\Http\Controllers\Api\Child\ToggleCourseFavoriteController;
use App\Http\Controllers\Api\Child\IndexFavoriteCoursesController;

// ---------- Teacher ----------
use App\Http\Controllers\Api\Auth\SetTeacherLevelMaterialController;
use App\Http\Controllers\Api\Auth\SetTeacherLevelSectionMaterialController;
use App\Http\Controllers\Api\Level\GetTeacherLevelSectionMaterialsController;
use App\Http\Controllers\Api\Book\InvalidateBookController;
use App\Http\Controllers\Api\Book\ValidateBookController;
use App\Http\Controllers\Api\Child\StoreTeacherReviewController;

// ---------- Child / ParentDashboard ----------
use App\Http\Controllers\Api\Child\LikeMediaController;
use App\Http\Controllers\Api\Child\GetIconVideosController;
use App\Http\Controllers\Api\Child\GetTeacherByIdController;
use App\Http\Controllers\Api\Child\FollowTeacherController;
use App\Http\Controllers\Api\Child\GetChildDashboardController;
use App\Http\Controllers\Api\Child\LogChildActivityController;
use App\Http\Controllers\Api\Child\GetTeacherFollowersController;
use App\Http\Controllers\Api\Meeting\IndexMeetingsForChildController;
use App\Http\Controllers\Api\Meeting\GetMeetingDetailForChildController;

// ---------- Profile ----------
use App\Http\Controllers\Api\User\UpdateUserProfileController;
use App\Http\Controllers\Api\TestWsController;
use App\Http\Controllers\Api\Admin\CreateChildController as UserCreateChildController;
use App\Http\Controllers\Api\Admin\ToggleValidationIconMediaController;
use App\Http\Controllers\Api\Admin\ApproveIconMediaController;
use App\Http\Controllers\Api\Admin\RejectIconMediaController;
use App\Http\Controllers\Api\Admin\RequestChangesIconMediaController;
use App\Http\Controllers\Api\Admin\GetPendingIconMediaController;
use App\Http\Controllers\Api\Admin\GetAllPendingIconMediaController;
use App\Http\Controllers\Api\Admin\GetIconMediaStatsController;
use App\Http\Controllers\Api\Admin\BulkApproveIconMediaController;
use App\Http\Controllers\Api\Auth\ConsumeHandoffController;
use App\Http\Controllers\Api\Auth\ExitImpersonationController as AuthExitImpersonationController;
use App\Http\Controllers\Api\Auth\ImpersonateController as AuthImpersonateController;
use App\Http\Controllers\Api\Book\GetBookCountsByLevelController;
use App\Http\Controllers\Api\Book\GetChannelMediaStatsController;
use App\Http\Controllers\Api\Book\IndexBooksForTeacherController;
use App\Http\Controllers\Api\Book\IndexMinistryBooksForTeacherController;
use App\Http\Controllers\Api\Book\ResizeBookIconController;
use App\Http\Controllers\Api\Book\UpdateIconTitleController;
use App\Http\Controllers\Api\Child\GetCourseByIdForChildController;
use App\Http\Controllers\Api\Child\GetPlanDetailForChildController;
use App\Http\Controllers\Api\User\CreateTeacherTrailerMultipartUploadController;
use App\Http\Controllers\Api\User\SignTeacherTrailerMultipartUploadPartController;
use App\Http\Controllers\Api\User\AbortTeacherTrailerMultipartUploadController;
use App\Http\Controllers\Api\User\CompleteTeacherTrailerMultipartUploadController;
use App\Http\Controllers\Api\User\DeleteTeacherTrailerController;
use App\Http\Controllers\Api\Child\IndexCoursesForChildController;
use App\Http\Controllers\Api\Child\IndexPlansForChildController;
use App\Http\Controllers\Api\Level\GetTeacherLevelMaterialsController as LevelGetTeacherLevelMaterialsController;
use App\Http\Controllers\Api\Meeting\DeleteMeetingController;
use App\Http\Controllers\Api\Meeting\GetMeetingByIdController;
use App\Http\Controllers\Api\Meeting\IndexMeetingsController;
use App\Http\Controllers\Api\Meeting\StoreMeetingController;
use App\Http\Controllers\Api\Meeting\UpdateMeetingController;
use App\Http\Controllers\Api\Meeting\DeleteUpcomingMeetingTimesController;
use App\Http\Controllers\Api\Meeting\UpdateMeetingTimeController;
use App\Http\Controllers\Api\Meeting\DeleteMeetingTimeController;
use App\Http\Controllers\Api\Meeting\RescheduleMeetingTimeController;
use App\Http\Controllers\Api\Meeting\CancelMeetingTimeController;
use App\Http\Controllers\Api\Meeting\ResetCanceledMeetingTimeController;
use App\Http\Controllers\Api\Meeting\UploadMeetingTimeMediaController;
use App\Http\Controllers\Api\Meeting\CompleteMultipartMeetingTimeMediaController;
use App\Http\Controllers\Api\Meeting\AddSessionsToGroupController;
use App\Http\Controllers\Api\Meeting\UpdateGroupController;
use App\Http\Controllers\Api\Meeting\DeleteGroupController;
use App\Http\Controllers\Api\Meeting\StoreGroupController;
use App\Http\Controllers\Api\Meeting\GetMeetingSessionsController;
use App\Http\Controllers\Api\Meeting\IndexBlockedSlotsController;
use App\Http\Controllers\Api\Meeting\StoreBlockedSlotController;
use App\Http\Controllers\Api\Meeting\DestroyBlockedSlotController;
use App\Http\Controllers\Api\Plan\DeletePlanFeatureController as PlanDeletePlanFeatureController;
use App\Http\Controllers\Api\Plan\GetAvailableEntitiesController as PlanGetAvailableEntitiesController;
use App\Http\Controllers\Api\Plan\IndexPlanFeatureController as PlanIndexPlanFeatureController;
use App\Http\Controllers\Api\Plan\StorePlanFeatureController as PlanStorePlanFeatureController;
use App\Http\Controllers\Api\Plan\SyncPlanAccessibleEntitiesController as PlanSyncPlanAccessibleEntitiesController;
use App\Http\Controllers\Api\Plan\TogglePlanPricingStatusController as PlanTogglePlanPricingStatusController;
use App\Http\Controllers\Api\Plan\UpdatePlanFeatureController as PlanUpdatePlanFeatureController;
use App\Http\Controllers\Api\User\CreateStaffController;
use App\Http\Controllers\Api\User\CreateTeacherController;
use App\Http\Controllers\Api\User\AdminUpdateUserController;
use App\Http\Controllers\Api\User\DeleteUserController;
use App\Http\Controllers\Api\User\GenerateTokenController;
use App\Http\Controllers\Api\User\GetUserByIdController;
use App\Http\Controllers\Api\User\ImpersonateUserController;
use App\Http\Controllers\Api\User\IndexParentsController;
use App\Http\Controllers\Api\User\IndexStaffController;
use App\Http\Controllers\Api\User\ToggleUserStatusController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ====================== AUTHENTICATED ======================
Route::middleware(['auth:api'])->group(function () {
    Route::post('admin/exit-impersonation', AuthExitImpersonationController::class);

    // -------------------- Admin --------------------
    Route::prefix('admin')->group(function () {
        Route::prefix('roles')->group(function () {
            Route::get('/', IndexRoleController::class)->middleware('permission:' . PermissionsEnum::ROLE_READ->value);
            Route::post('/', StoreRoleController::class)->middleware('permission:' . PermissionsEnum::ROLE_CREATE->value);
            Route::get('{role}', GetRoleByIdController::class)->middleware('permission:' . PermissionsEnum::ROLE_READ->value);
            Route::put('{role}', UpdateRoleController::class)->middleware('permission:' . PermissionsEnum::ROLE_UPDATE->value);
            Route::delete('{role}', DeleteRoleController::class)->middleware('permission:' . PermissionsEnum::ROLE_DELETE->value);
            Route::post('assign/{user}', AssignRoleToUserController::class)->middleware('permission:' . PermissionsEnum::ROLE_ASSIGN->value);
        });
        Route::prefix('permissions')->group(function () {
            Route::get('/', IndexPermissionController::class)->middleware('permission:' . PermissionsEnum::PERMISSION_READ->value);
            Route::get('grouped', GetGroupedPermissionsController::class)->middleware('permission:' . PermissionsEnum::PERMISSION_READ->value);
        });
        Route::prefix('levels')->group(function () {
            Route::post('/', CreateLevelController::class)->middleware('permission:' . PermissionsEnum::LEVEL_CREATE->value);
            Route::delete('{levelId}', DeleteLevelController::class)->middleware('permission:' . PermissionsEnum::LEVEL_DELETE->value);
            Route::patch('{levelId}', UpdateLevelController::class)->middleware('permission:' . PermissionsEnum::LEVEL_UPDATE->value);
            Route::get('{levelId}/materials', AssignMaterialsToLevelController::class)->middleware('permission:' . PermissionsEnum::LEVEL_ASSIGN_MATERIALS->value);
        });
        Route::prefix('materials')->group(function () {
            Route::post('/', CreateMaterialController::class)->middleware('permission:' . PermissionsEnum::MATERIAL_CREATE->value);
            Route::patch('{materialId}', UpdateMaterialController::class)->middleware('permission:' . PermissionsEnum::MATERIAL_UPDATE->value);
            Route::delete('{materialId}', DeleteMaterialController::class)->middleware('permission:' . PermissionsEnum::MATERIAL_DELETE->value);
        });
        Route::get('level-types', IndexLevelTypesController::class);
        Route::post('level-types', StoreLevelTypeController::class);
        Route::patch('level-types/{levelTypeId}', UpdateLevelTypeController::class);
        Route::post('level-types/save', SaveCycleController::class);
        Route::prefix('level-types/{levelTypeId}/periods')->group(function () {
            Route::get('/', IndexLevelTypePeriodsController::class);
            Route::post('/', StoreLevelTypePeriodController::class);
        });
        Route::prefix('level-type-periods')->group(function () {
            Route::patch('{periodId}', UpdateLevelTypePeriodController::class);
            Route::delete('{periodId}', DeleteLevelTypePeriodController::class);
        });
        Route::prefix('sections')->group(function () {
            Route::get('/', IndexSectionsController::class)->middleware('permission:' . PermissionsEnum::SECTION_READ->value);
            Route::post('/', CreateSectionController::class)->middleware('permission:' . PermissionsEnum::SECTION_CREATE->value);
            Route::patch('{sectionId}', UpdateSectionController::class)->middleware('permission:' . PermissionsEnum::SECTION_UPDATE->value);
            Route::delete('{sectionId}', DeleteSectionController::class)->middleware('permission:' . PermissionsEnum::SECTION_DELETE->value);
            Route::post('{sectionId}/materials', AssignMaterialsToSectionController::class)->middleware('permission:' . PermissionsEnum::SECTION_ASSIGN_MATERIALS->value);
        });
        Route::post('level-sections/{levelSectionId}/materials', AssignMaterialsToLevelSectionController::class)->middleware('permission:' . PermissionsEnum::SECTION_ASSIGN_MATERIALS->value);
        Route::patch('level-section-materials/{levelSectionMaterialId}/sharing-group', UpdateLevelSectionMaterialSharingGroupController::class)->middleware('permission:' . PermissionsEnum::SECTION_UPDATE->value);
        Route::post('levels/{levelId}/sections/sync', SyncSectionsToLevelController::class)->middleware('permission:' . PermissionsEnum::SECTION_UPDATE->value);
        Route::prefix('plans')->group(function () {
            Route::get('/', IndexPlanController::class)->middleware('permission:' . PermissionsEnum::PLAN_READ->value);
            Route::post('/', StorePlanController::class)->middleware('permission:' . PermissionsEnum::PLAN_CREATE->value);
            Route::get('{id}', ShowPlanController::class)->middleware('permission:' . PermissionsEnum::PLAN_READ->value);
            Route::post('{id}', UpdatePlanController::class)->middleware('permission:' . PermissionsEnum::PLAN_UPDATE->value);
            Route::delete('{id}', DestroyPlanController::class)->middleware('permission:' . PermissionsEnum::PLAN_DELETE->value);
            Route::post('{id}/duplicate', DuplicatePlanController::class)->middleware('permission:' . PermissionsEnum::PLAN_CREATE->value);
            Route::post('{planId}/accessible-entities/sync', PlanSyncPlanAccessibleEntitiesController::class)->middleware('permission:' . PermissionsEnum::PLAN_UPDATE->value);
            Route::post('plan-pricings/{id}/toggle-status', PlanTogglePlanPricingStatusController::class)->middleware('permission:' . PermissionsEnum::PLAN_UPDATE->value);
            Route::get('plan-accessible-entities/available', PlanGetAvailableEntitiesController::class)->middleware('permission:' . PermissionsEnum::PLAN_UPDATE->value);
        });
        Route::prefix('plan-features')->group(function () {
            Route::get('/', PlanIndexPlanFeatureController::class)->middleware('permission:' . PermissionsEnum::PLAN_READ->value);
            Route::post('/', PlanStorePlanFeatureController::class)->middleware('permission:' . PermissionsEnum::PLAN_MANAGE_FEATURES->value);
            Route::post('{id}', PlanUpdatePlanFeatureController::class)->middleware('permission:' . PermissionsEnum::PLAN_MANAGE_FEATURES->value);
            Route::delete('{id}', PlanDeletePlanFeatureController::class)->middleware('permission:' . PermissionsEnum::PLAN_MANAGE_FEATURES->value);
        });
        Route::get('trial-settings', \App\Http\Controllers\Api\Admin\GetTrialSettingsController::class)->middleware('role:admin');
        Route::put('trial-settings', \App\Http\Controllers\Api\Admin\UpdateTrialSettingsController::class)->middleware('role:admin');
        Route::get('promo-config', \App\Http\Controllers\Api\Admin\GetPromoConfigController::class)->middleware('role:admin');
        Route::put('promo-config', \App\Http\Controllers\Api\Admin\UpdatePromoConfigController::class)->middleware('role:admin');

        // -------------------- Discount Templates --------------------
        Route::prefix('discount-templates')->group(function () {
            Route::get('/', \App\Http\Controllers\Api\DiscountTemplate\IndexDiscountTemplatesController::class)
                ->middleware('permission:' . PermissionsEnum::DISCOUNT_TEMPLATE_READ->value);
            Route::get('{id}', \App\Http\Controllers\Api\DiscountTemplate\ShowDiscountTemplateController::class)
                ->middleware('permission:' . PermissionsEnum::DISCOUNT_TEMPLATE_READ->value);
            Route::post('/', \App\Http\Controllers\Api\DiscountTemplate\StoreDiscountTemplateController::class)
                ->middleware('permission:' . PermissionsEnum::DISCOUNT_TEMPLATE_CREATE->value);
            Route::put('{id}', \App\Http\Controllers\Api\DiscountTemplate\UpdateDiscountTemplateController::class)
                ->middleware('permission:' . PermissionsEnum::DISCOUNT_TEMPLATE_UPDATE->value);
            Route::delete('{id}', \App\Http\Controllers\Api\DiscountTemplate\DeleteDiscountTemplateController::class)
                ->middleware('permission:' . PermissionsEnum::DISCOUNT_TEMPLATE_DELETE->value);
        });
        Route::get('ceo-settings', GetCeoSettingController::class)->middleware('role:admin');
        Route::put('ceo-settings', UpdateCeoSettingController::class)->middleware('role:admin');
        Route::post('validate-ceo-code', \App\Http\Controllers\Api\Admin\ValidateCeoCodeController::class)->middleware('role:admin');

        // -------------------- Services (Activation Matrix) --------------------
        Route::prefix('services')->group(function () {
            Route::get('/', IndexServicesController::class)
                ->middleware('permission:' . PermissionsEnum::SERVICE_READ->value);
            Route::get('levels/{levelId}', GetServicesForLevelController::class)
                ->middleware('permission:' . PermissionsEnum::SERVICE_READ->value);
            Route::patch('{serviceId}/level-restrictions', UpdateServiceLevelRestrictionsController::class)
                ->middleware('permission:' . PermissionsEnum::SERVICE_CONFIGURE->value);
            Route::patch('{serviceId}/levels/{levelId}/toggle', ToggleLevelServiceController::class)
                ->middleware('permission:' . PermissionsEnum::SERVICE_CONFIGURE->value);
            Route::patch('{serviceId}/level-sections/{levelSectionId}/toggle', ToggleLevelSectionServiceController::class)
                ->middleware('permission:' . PermissionsEnum::SERVICE_CONFIGURE->value);
            Route::patch('{serviceId}/level-section-materials/{levelSectionMaterialId}/toggle', ToggleLevelSectionMaterialServiceController::class)
                ->middleware('permission:' . PermissionsEnum::SERVICE_CONFIGURE->value);
            Route::patch('{serviceId}/level-materials/{levelMaterialId}/toggle', ToggleLevelMaterialServiceController::class)
                ->middleware('permission:' . PermissionsEnum::SERVICE_CONFIGURE->value);
        });

        Route::get('teachers', IndexTeachersController::class)->middleware('permission:' . PermissionsEnum::USER_READ->value);
        Route::post('teachers', CreateTeacherController::class)->middleware('permission:' . PermissionsEnum::USER_CREATE->value);
        Route::get('teachers/{id}', GetUserByIdController::class)->middleware('permission:' . PermissionsEnum::USER_READ->value);
        Route::post('teachers/{id}', AdminUpdateUserController::class)->middleware('permission:' . PermissionsEnum::USER_UPDATE->value);

        Route::get('parents', IndexParentsController::class)->middleware('permission:' . PermissionsEnum::USER_READ->value);
        Route::post('/parents', CreateParentController::class)->middleware('permission:' . PermissionsEnum::USER_CREATE->value);
        Route::get('/parents/{id}', GetUserByIdController::class)->middleware('permission:' . PermissionsEnum::USER_READ->value);
        Route::post('/parents/{id}', AdminUpdateUserController::class)->middleware('permission:' . PermissionsEnum::USER_UPDATE->value);

        Route::post('children', UserCreateChildController::class)->middleware('permission:' . PermissionsEnum::USER_CREATE->value);
        Route::delete('children/{childId}', AdminDeleteChildController::class)->middleware('permission:' . PermissionsEnum::USER_DELETE->value);
        Route::post('children/{childId}/edit', AdminUpdateUserController::class)->middleware('permission:' . PermissionsEnum::USER_UPDATE->value);

        Route::get('staff', IndexStaffController::class)->middleware('permission:' . PermissionsEnum::USER_READ->value);
        Route::post('staff', CreateStaffController::class)->middleware('permission:' . PermissionsEnum::USER_CREATE->value);
        Route::post('staff/{id}', AdminUpdateUserController::class)->middleware('permission:' . PermissionsEnum::USER_UPDATE->value);
        Route::delete('users/{userId}', DeleteUserController::class)->middleware('permission:' . PermissionsEnum::USER_DELETE->value);
        Route::put('users/{userId}/status', ToggleUserStatusController::class)->middleware('permission:' . PermissionsEnum::USER_UPDATE->value);
        Route::get('users/{userId}', GetUserByIdController::class)->middleware('permission:' . PermissionsEnum::USER_READ->value);

        Route::post('impersonate/token-generate/{userId}', GenerateTokenController::class)->middleware('permission:' . PermissionsEnum::USER_IMPERSONATE->value);
        Route::post('impersonate/{userId}', AuthImpersonateController::class)->middleware('permission:' . PermissionsEnum::USER_IMPERSONATE->value);

        Route::get('stats/parent-registrations', GetParentRegistrationStatsController::class)->middleware('permission:' . PermissionsEnum::USER_STATS->value);

        Route::prefix('books')->group(function () {
            Route::post('validate/{bookId}', ValidateBookController::class)->middleware('permission:' . PermissionsEnum::BOOK_VALIDATE->value);
            Route::post('invalidate/{bookId}', InvalidateBookController::class)->middleware('permission:' . PermissionsEnum::BOOK_VALIDATE->value);
            Route::post('media/{mediaId}/toggle-validation', ToggleValidationIconMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_VALIDATE_MEDIA->value);
            Route::post('media/{mediaId}/approve', ApproveIconMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_VALIDATE_MEDIA->value);
            Route::post('media/bulk-approve', BulkApproveIconMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_VALIDATE_MEDIA->value);
            Route::post('media/{mediaId}/reject', RejectIconMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_VALIDATE_MEDIA->value);
            Route::post('media/{mediaId}/request-changes', RequestChangesIconMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_VALIDATE_MEDIA->value);
            Route::get('all-pending-media', GetAllPendingIconMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::get('media/stats', GetIconMediaStatsController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::get('{book}/pending-icon-media', GetPendingIconMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);

            Route::get('ministry', IndexAdminBooksController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::get('counts-by-level', GetBookCountsByLevelController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::get('teachers', IndexTeacherBooksController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);

            Route::get('/', IndexBooksController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::post('/', StoreBookController::class)->middleware('permission:' . PermissionsEnum::BOOK_CREATE->value);

            Route::post('draft', CreateBookDraftController::class)->middleware('permission:' . PermissionsEnum::BOOK_CREATE->value);
            Route::post('{book}/pdf/multipart', CreateBookPdfMultipartUploadController::class)->middleware('permission:' . PermissionsEnum::BOOK_CREATE->value);
            Route::post('{book}/pdf/multipart/part', SignBookPdfMultipartUploadPartController::class)->middleware('permission:' . PermissionsEnum::BOOK_CREATE->value);
            Route::post('{book}/pdf/multipart/complete', CompleteBookPdfMultipartUploadController::class)->middleware('permission:' . PermissionsEnum::BOOK_CREATE->value);
            Route::post('{book}/pdf/multipart/abort', AbortBookPdfMultipartUploadController::class)->middleware('permission:' . PermissionsEnum::BOOK_CREATE->value);

            Route::post('upload-media', UploadMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_UPLOAD_MEDIA->value);
            Route::post('upload-media/multipart', CreateMediaMultipartUploadController::class)->middleware('permission:' . PermissionsEnum::BOOK_UPLOAD_MEDIA->value);
            Route::post('upload-media/multipart/part', SignMediaMultipartUploadPartController::class)->middleware('permission:' . PermissionsEnum::BOOK_UPLOAD_MEDIA->value);
            Route::post('upload-media/multipart/complete', CompleteMediaMultipartUploadController::class)->middleware('permission:' . PermissionsEnum::BOOK_UPLOAD_MEDIA->value);
            Route::post('upload-media/multipart/abort', AbortMediaMultipartUploadController::class)->middleware('permission:' . PermissionsEnum::BOOK_UPLOAD_MEDIA->value);
            Route::post('{book}', UpdateBookController::class)->middleware('permission:' . PermissionsEnum::BOOK_UPDATE->value);
            Route::delete('{book}', DeleteBookController::class)->middleware('permission:' . PermissionsEnum::BOOK_DELETE->value);

            Route::get('{book}/modules', IndexBookModulesController::class)->middleware('permission:' . PermissionsEnum::BOOK_MODULE_READ->value);
            Route::post('{book}/modules', StoreBookModuleController::class)->middleware('permission:' . PermissionsEnum::BOOK_MODULE_CREATE->value);
            Route::post('{book}/modules/{module}', UpdateBookModuleController::class)->middleware('permission:' . PermissionsEnum::BOOK_MODULE_UPDATE->value);
            Route::delete('{book}/modules/{module}', DeleteBookModuleController::class)->middleware('permission:' . PermissionsEnum::BOOK_MODULE_DELETE->value);
            Route::get('{book}/modules/{module}/icons', GetModuleIconsController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);

            Route::post('{book}/icons', StoreBookIconsController::class)->middleware('permission:' . PermissionsEnum::BOOK_UPLOAD_MEDIA->value);
            Route::post('{book}/icons/{iconId}', UpdateBookIconController::class)->middleware('permission:' . PermissionsEnum::BOOK_MANAGE_MEDIA->value);
            Route::delete('{book}/icons/{iconId}', DeleteBookIconsController::class)->middleware('permission:' . PermissionsEnum::BOOK_MANAGE_MEDIA->value);
            Route::delete('{book}/icon-with-media/{iconId}', DeleteIconWithMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_MANAGE_MEDIA->value);
            Route::post('{book}/language', SetBookLanguageController::class)->middleware('permission:' . PermissionsEnum::BOOK_SET_LANGUAGE->value);
            Route::post('resize/{iconId}', ResizeBookIconController::class)->middleware('permission:' . PermissionsEnum::BOOK_MANAGE_MEDIA->value);
            Route::patch('icons/{iconId}/title', UpdateIconTitleController::class)->middleware('permission:' . PermissionsEnum::BOOK_MANAGE_MEDIA->value);

            Route::get('videos/status/{mediaId}', GetVideoProcessingStatusController::class);
            Route::get('all-videos', IndexVideosForUserController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::get('channel-stats', GetChannelMediaStatsController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::get('{iconId}/media/picker', GetIconMediaPickerController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::get('{iconId}/station-content', GetIconStationContentController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::post('icons/batch-station-content', GetBatchIconStationContentController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::get('/{id}', GetBookByIdController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);

            Route::delete('{mediaId}/delete-video', DeleteMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_MANAGE_MEDIA->value);
            Route::get('{videoId}/get-video', GetBookVideoByIdController::class)->middleware('permission:' . PermissionsEnum::BOOK_READ->value);
            Route::post('{iconId}/videos/sync', SyncIconVideosController::class)->middleware('permission:' . PermissionsEnum::BOOK_MANAGE_MEDIA->value);
            Route::post('{iconId}/media/multipart/complete', CompleteIconMediaMultipartUploadController::class)->middleware('permission:' . PermissionsEnum::BOOK_UPLOAD_MEDIA->value);
            Route::post('{iconId}/media', UploadIconMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_UPLOAD_MEDIA->value);
            Route::post('media/{media}', UpdateMediaController::class)->middleware('permission:' . PermissionsEnum::BOOK_MANAGE_MEDIA->value);
            Route::get('{mediaId}/transcoding-status', GetVideoTranscodingStatusController::class);
        });
        Route::prefix('courses')->group(function () {
            Route::get('/', IndexCoursesController::class);
            Route::get('{id}', action: ShowCourseController::class);
            Route::post('/', StoreCourseController::class)->middleware('permission:' . PermissionsEnum::COURSE_CREATE->value);
            Route::delete('{courseId}', DeleteCourseController::class)->middleware('permission:' . PermissionsEnum::COURSE_DELETE->value);
            Route::post('chapters/{chapterId}/videos', UploadChapterVideoController::class)->middleware('permission:' . PermissionsEnum::COURSE_UPLOAD_VIDEO->value);
        });

        Route::prefix('blocked-slots')->group(function () {
            Route::get('/', IndexBlockedSlotsController::class);
            Route::post('/', StoreBlockedSlotController::class);
            Route::delete('/{id}', DestroyBlockedSlotController::class);
        });

        Route::prefix('meetings')->group(function () {
            Route::post('/', StoreMeetingController::class);
            Route::get('', IndexMeetingsController::class);
            Route::get('/{id}', GetMeetingByIdController::class);
            Route::get('/{id}/sessions', GetMeetingSessionsController::class);
            Route::post('/{id}', UpdateMeetingController::class);
            Route::delete('/{id}', DeleteMeetingController::class);
            Route::post('/{meetingId}/groups', StoreGroupController::class);
            Route::put('/{meetingId}/groups/{groupId}', UpdateGroupController::class);
            Route::delete('/{meetingId}/groups/{groupId}', DeleteGroupController::class);
            Route::post('/{meetingId}/groups/{groupId}/sessions', AddSessionsToGroupController::class);
            Route::prefix('times')->group(function () {
                Route::put('{id}', UpdateMeetingTimeController::class);
                Route::put('{id}/reschedule', RescheduleMeetingTimeController::class);
                Route::put('{id}/cancel', CancelMeetingTimeController::class);
                Route::put('{id}/reset', ResetCanceledMeetingTimeController::class);
                Route::post('{id}/media', UploadMeetingTimeMediaController::class);
                Route::post('{id}/media/multipart/complete', CompleteMultipartMeetingTimeMediaController::class);
                Route::delete('{id}', DeleteMeetingTimeController::class);
                Route::delete('{id}/upcoming', DeleteUpcomingMeetingTimesController::class);
            });
        });
    });
    Route::post('teacher/level-materials', SetTeacherLevelMaterialController::class)->middleware('permission:' . PermissionsEnum::TEACHER_MANAGE_MATERIALS->value);
    Route::get('teacher/teacher-level-materials', LevelGetTeacherLevelMaterialsController::class)->middleware('permission:' . PermissionsEnum::TEACHER_MANAGE_MATERIALS->value);
    Route::post('teacher/level-section-materials', SetTeacherLevelSectionMaterialController::class)->middleware('permission:' . PermissionsEnum::TEACHER_MANAGE_MATERIALS->value);
    Route::get('teacher/level-section-materials', GetTeacherLevelSectionMaterialsController::class)->middleware('permission:' . PermissionsEnum::TEACHER_MANAGE_MATERIALS->value);

    Route::get('teacher/books', IndexBooksForTeacherController::class);
    Route::get('teacher/books/ministry', IndexMinistryBooksForTeacherController::class);
    Route::get('teacher/books/{book}/modules', IndexBookModulesController::class)->middleware('permission:' . PermissionsEnum::BOOK_MODULE_READ->value);
    Route::post('teacher/books/{book}/modules', StoreBookModuleController::class)->middleware('permission:' . PermissionsEnum::BOOK_MODULE_CREATE->value);
    Route::post('teacher/books/{book}/modules/{module}', UpdateBookModuleController::class)->middleware('permission:' . PermissionsEnum::BOOK_MODULE_UPDATE->value);
    Route::delete('teacher/books/{book}/modules/{module}', DeleteBookModuleController::class)->middleware('permission:' . PermissionsEnum::BOOK_MODULE_DELETE->value);

    // -------------------- Parent --------------------
    Route::middleware(['role:parent'])
        ->prefix('parent')
        ->group(function () {
            Route::post('create-child', CreateChildController::class);
            Route::delete('children/{childId}', DeleteChildController::class)->whereNumber('childId');
            Route::post('switch-to-child', SwitchToChildController::class);

            Route::prefix('books')->group(function () {
                Route::get('/', IndexBooksController::class);
                Route::get('{id}', GetBookByIdController::class)->whereNumber('id');
                Route::post('{id}/track', TrackBookOpenController::class)->whereNumber('id');
                Route::get('{iconId}/station-content', GetIconStationContentController::class)->whereNumber('iconId');
            });
        });

    // -------------------- Child --------------------
    Route::middleware(['role:child'])
        ->prefix('child')
        ->group(function () {
            Route::post('switch-to-parent', SwitchToParentController::class);
            Route::get('dashboard', GetChildDashboardController::class);
            Route::post('activities', LogChildActivityController::class);

            Route::post('{mediaId}/like', LikeMediaController::class)->whereNumber('mediaId');
            Route::get('{iconId}/videos', GetIconVideosController::class)->whereNumber('iconId');
            Route::post('media/{mediaId}/view', TrackMediaViewController::class)->whereNumber('mediaId');

            Route::prefix('teachers')->group(function () {
                Route::get('{id}', GetTeacherByIdController::class)->whereNumber('id');
                Route::post('{teacherId}/follow', FollowTeacherController::class)->whereNumber('teacherId');
                Route::post('{teacherId}/review', StoreTeacherReviewController::class)->whereNumber('teacherId');
                Route::get('{teacherId}/followers', GetTeacherFollowersController::class)->whereNumber('teacherId');
            });

            Route::prefix('plans')->group(function () {
                Route::get('/', IndexPlansForChildController::class);
                Route::get('{id}/details', GetPlanDetailForChildController::class)->whereNumber('id');
            });

            Route::prefix('courses')->group(function () {
                Route::get('/', IndexCoursesForChildController::class);
                Route::get('favorites', IndexFavoriteCoursesController::class);
                Route::get('{id}', GetCourseByIdForChildController::class)->whereNumber('id');
                Route::post('{course}/favorite', ToggleCourseFavoriteController::class)->whereNumber('course');
            });

            Route::prefix('books')->group(function () {
                Route::get('/', IndexBooksController::class);

                Route::get('{id}', GetBookByIdController::class)->whereNumber('id');

                Route::get('{book}/icons/{iconId}', GetIconByIdController::class)->whereNumber('book')->whereNumber('iconId');
            });
            Route::prefix('meetings')->group(function () {
                Route::get('/', IndexMeetingsForChildController::class);
                Route::get('{id}', GetMeetingDetailForChildController::class)->whereNumber('id');
            });
        });

    // -------- Parent OR Child --------
    Route::middleware(['role:parent|child'])->group(function () {
        Route::get('parent-dashboard/{child}', GetChildDashboardController::class)->whereNumber('child');
        Route::post('child-activities', LogChildActivityController::class);
    });
    // ------- All roles ----------
    Route::get('levels', IndexLevelsController::class);
    Route::get('materials', IndexMaterialsController::class);
    Route::get('level-materials', GetLevelMaterialsController::class);
    Route::get('levels/{levelId}/level-materials', ListLevelMaterialsByLevelController::class)->whereNumber('levelId');

    Route::post('user/profile', UpdateUserProfileController::class);

    Route::middleware(['role:teacher'])->group(function () {
        Route::post('user/trailer/multipart', CreateTeacherTrailerMultipartUploadController::class);
        Route::post('user/trailer/multipart/part', SignTeacherTrailerMultipartUploadPartController::class);
        Route::post('user/trailer/multipart/complete', CompleteTeacherTrailerMultipartUploadController::class);
        Route::post('user/trailer/multipart/abort', AbortTeacherTrailerMultipartUploadController::class);
        Route::delete('user/trailer', DeleteTeacherTrailerController::class);
    });

    Route::prefix('videos/{videoId}')->group(function () {
        Route::post('session/start', \App\Http\Controllers\Api\Video\StartVideoSessionController::class);
        Route::post('session/progress', \App\Http\Controllers\Api\Video\UpdateVideoProgressController::class);
        Route::post('session/end', \App\Http\Controllers\Api\Video\EndVideoSessionController::class);
        Route::get('session', \App\Http\Controllers\Api\Video\GetVideoSessionController::class);
    });

    Route::post('heartbeat', \App\Http\Controllers\Api\User\HeartbeatController::class);

    Route::post('refresh-token', RefreshTokenController::class);
});
// ====================== GUEST ======================
Route::middleware('guest:api')->group(function () {
    Route::post('register-parent', RegisterParentController::class);
    Route::post('register-teacher', RegisterTeacherController::class);
    Route::post('login', LoginController::class);
    Route::post('parent-login', ParentLoginController::class);
    Route::post('admin-login', AdminLoginController::class);
    Route::post('verify-code', VerifyCodeController::class);
    Route::post('send-reset-code', SendResetCodeController::class);
    Route::post('resend-verification-code', ResendVerificationCodeController::class);
    Route::post('reset-password', ResetPasswordController::class);
    // Route::get('materials', IndexMaterialsController::class);

    Route::get('books/child/{id}', GetBookByIdForChildController::class);
});

// These two are genuinely public (no auth required either way), not
// "guest only" - `guest:api` would actively redirect an *already*
// authenticated caller (e.g. a browser tab that still has a stale token
// from an earlier session) to /home instead of letting the request through,
// which breaks the cross-app impersonation handoff with a CORS error since
// /home isn't in the CORS-allowed paths.
Route::post('impersonate/{token}', ImpersonateUserController::class);
Route::post('impersonate/handoff/{code}', ConsumeHandoffController::class);


Route::prefix('public')->group(function () {
    Route::get('level-types', \App\Http\Controllers\Api\Public\GetPublicLevelTypesController::class);
    Route::get('levels', \App\Http\Controllers\Api\Public\GetPublicLevelsController::class);
});

Route::post('draft-session', \App\Http\Controllers\Api\DraftSession\CreateDraftSessionController::class);

Route::middleware(['auth.draft'])->prefix('draft')->group(function () {
    Route::get('session/restore',              \App\Http\Controllers\Api\DraftSession\RestoreDraftSessionController::class);
    Route::post('session/interact',            \App\Http\Controllers\Api\DraftSession\LogDraftInteractionController::class);
    Route::post('session/check-parent',        \App\Http\Controllers\Api\DraftSession\CheckParentAvailabilityController::class);
    Route::post('session/complete',            \App\Http\Controllers\Api\DraftSession\CompleteDraftSessionController::class);
    Route::get('books',                        \App\Http\Controllers\Api\DraftSession\GetDraftBooksController::class);
    Route::get('books/{id}',                   \App\Http\Controllers\Api\DraftSession\GetDraftBookByIdController::class);
    Route::get('books/{iconId}/station-content', GetIconStationContentController::class)->whereNumber('iconId');
    Route::get('level-materials',              \App\Http\Controllers\Api\DraftSession\GetDraftLevelMaterialsController::class);
});

// Reverb broadcast channel authentication — JWT-guarded so frontend Echo can
// authenticate private channels using the same Bearer token as the REST API.
Route::post('/broadcasting/auth', function (Request $request) {
    return Broadcast::auth($request);
})->middleware('auth:api');
