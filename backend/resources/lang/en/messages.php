<?php

return [
    // _______________ AUTH _______________
    'create_success' => 'Role created successfully',
    'create_failed' => 'Failed to create role',
    'permissions_assigned' => 'Permissions assigned successfully',
    'permissions_assigned_failed' => 'Failed to assign permissions',
    'role_assigned' => 'Role assigned to user successfully.',
    'role_assign_failed' => 'Failed to assign role to user.',

    // _______________ EMAILS _______________
    'email_subject_verify' => 'Verify your Abajim account',
    'email_greeting' => 'Welcome To Abajim, :name',
    'roles' => ['teacher' => 'Teacher', 'parent' => 'Parent'],
    'welcome_message' => 'Thank you for joining us as a <strong>:role</strong>.',
    'email_instruction' => 'To activate your account, please use the following verification code:',
    'email_code_expires' => 'This code is valid for 10 minutes.',
    'email_contact_us' => 'Contact us',
    'email_footer_text' => 'Monday–Friday: 9:00–18:00 | Saturday: 9:30–13:00 / 14:00–17:00',
    'email_rights_reserved' => '&copy; Abajim :year',

    //_______________COMMON_______________
    'success' => 'Success',
    'failed' => 'Failed',
    'not_found' => 'Not Found',

    //_______________Materials_______________
    'material_created' => 'Material created successfully',
    'material_create_failed' => 'Failed to create material',
    'materials_assigned_to_level' => 'Materials assigned to level successfully',
    'materials_assigned_to_level_failed' => 'Failed to assign materials to level',
    'material_updated' => 'Material updated successfully',
    'material_update_failed' => 'Failed to update material',
    'user_not_found' => 'User not found with identifier: :identifier',
    'email_subject_reset' => 'Password Reset Code',
    'email_reset_greeting' => 'Hello :name,',
    'reset_password_message' => 'You requested a password reset. Use the code below to continue.',


    'saved_successfully' => 'Data saved successfully',

    // __________ IMPERSONATION __________
    'handoff_consumed' => 'Session resumed successfully.',
    'invalid_or_expired_handoff' => 'This link has expired or was already used. Please start again.',

        // __________ PLANS __________
    'plan_found'            => 'Plans found successfully.',
    'plan_highlighted_found'=> 'Highlighted plans found successfully.',
    'plan_detail_found'     => 'Plan details found successfully.',
    'plan_not_found'        => 'Plan not found.',
    'plan_error_retrieving' => 'Error retrieving plan data.',
    'plan_child_not_found'  => 'Child or child level not found for the authenticated user.',

    'invalid_credentials' => 'Invalid credentials',
    'account_not_verified' => 'Account not verified',
    'account_already_verified' => 'Account is already verified',
    'verification_code_sent_email' => 'Verification code sent to your email',
    'verification_code_sent_sms' => 'Verification code sent to your phone',
    'user_activated' => 'User activated successfully',
    'user_deactivated' => 'User deactivated successfully',
    'invalid_status' => 'Invalid status value',
    'cannot_deactivate_self' => 'You cannot deactivate your own account',
    'heartbeat_recorded' => 'Heartbeat recorded',
    'general_error' => 'Something went wrong',
    'validation_error' => 'Validation error',

    // ______________ MEETINGS ______________
    'meeting' => [
        'time_not_found' => 'Meeting time not found',
        'time_deleted_success' => 'Meeting time deleted successfully',
        'time_delete_failed' => 'Failed to delete meeting time',
        'upcoming_times_deleted_success' => 'Upcoming meeting times deleted successfully',
        'upcoming_times_delete_failed' => 'Failed to delete upcoming meeting times',
        'time_updated_success' => 'Meeting time updated successfully',
        'time_update_failed' => 'Failed to update meeting time',
        'time_rescheduled_success' => 'Meeting time rescheduled successfully',
        'time_reschedule_failed' => 'Failed to reschedule meeting time',
        'time_cancelled_success' => 'Meeting time cancelled successfully',
        'time_cancel_failed' => 'Failed to cancel meeting time',
        'time_reset_success' => 'Meeting time reset successfully',
        'time_reset_failed' => 'Failed to reset meeting time',
        'meeting_time_not_canceled' => 'Meeting time is not canceled',
        'time_conflict' => 'This time conflicts with an existing session',
        'duplicate_meeting_exists' => 'A meeting with this teacher, level, and material already exists. Please add sessions to the existing meeting or update it.',
        'duplicate_public_meeting_exists' => 'A public meeting with this teacher, level, and material already exists. Please add sessions to the existing meeting or create a private meeting instead.',
        'duplicate_private_meeting_exists' => 'A private meeting with this teacher, level, and material already exists. Please add sessions to the existing meeting or create a public meeting instead.',
        'name_required' => 'The name field is required',
        'name_string' => 'The name must be a string',
        'name_max' => 'The name may not be greater than 255 characters',
        'level_id_required' => 'The level ID field is required',
        'level_id_integer' => 'The level ID must be an integer',
        'level_id_exists' => 'The selected level is invalid',
        'material_id_required' => 'The material ID field is required',
        'material_id_integer' => 'The material ID must be an integer',
        'material_id_exists' => 'The selected material is invalid',
        'is_private_boolean' => 'The is private field must be true or false',
        'max_students_integer' => 'The max students must be an integer',
        'max_students_min' => 'The max students must be at least 1',
        'has_free_trial_boolean' => 'The has free trial field must be true or false',
        'total_sessions_required' => 'The total sessions field is required',
        'total_sessions_integer' => 'The total sessions must be an integer',
        'total_sessions_min' => 'The total sessions must be at least 1',
        'price_numeric' => 'The price must be a number',
        'price_min' => 'The price must be at least 0',
        'discount_numeric' => 'The discount must be a number',
        'discount_min' => 'The discount must be at least 0',
        'status_string' => 'The status must be a string',
        'status_in' => 'The selected status is invalid',
        'timezone_string' => 'The timezone must be a string',
        'timezone_max' => 'The timezone may not be greater than 50 characters',
        'meeting_groups_array' => 'The meeting groups must be an array',
        'group_name_string' => 'The group name must be a string',
        'group_name_max' => 'The group name may not be greater than 255 characters',
        'meeting_times_required' => 'The meeting times field is required',
        'meeting_times_array' => 'The meeting times must be an array',
        'meeting_date_required' => 'The meeting date field is required',
        'meeting_date_date' => 'The meeting date is not a valid date',
        'start_time_required' => 'The start time field is required',
        'start_time_string' => 'The start time must be a string',
        'end_time_required' => 'The end time field is required',
        'end_time_string' => 'The end time must be a string',
        'group_added_success' => 'Group added successfully',
        'group_updated_success' => 'Group updated successfully',
        'group_deleted_success' => 'Group deleted successfully',
        'sessions_added_success' => 'Sessions added successfully',
        'group_not_found' => 'Group not found',
        'teacher_conflict' => 'The teacher is already scheduled for another session at this time.',
    ],

    'validation' => [
        'required' => 'This field is required.',
        'password_confirmation' => 'Passwords do not match.',
        'password_complexity' => 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        'incorrect_current_password' => 'The current password is incorrect.',
        'phone_unique' => 'This phone number is already registered.',
        'email_unique' => 'This email address is already registered.',
    ],

    // ______________ CEO SETTINGS ______________
    'update_success' => 'Updated successfully',
    'update_failed' => 'Update failed',
    'current_code_incorrect' => 'The current CEO code is incorrect',
    'invalid_ceo_code' => 'Invalid CEO code',
    'ceo_code_not_configured' => 'CEO code has not been configured yet',

    // ______________ LEVELS ______________
    'levels' => [
        'year_1' => 'Year 1',
        'year_2' => 'Year 2',
        'year_3' => 'Year 3',
        'year_4' => 'Year 4',
        'year_5' => 'Year 5',
        'year_6' => 'Year 6',
        'levels_retrieved' => 'Levels retrieved successfully.',
        'level_created' => 'Level created successfully.',
        'level_updated' => 'Level updated successfully.',
        'level_deleted' => 'Level deleted successfully.',
        'level_not_found' => 'Level not found.',
        'level_name_required' => 'Level name is required',
        'level_name_unique' => "There's an other level with the same name",

    ],
    // ____________ CYCLE ______________
    'cycle_creation_failed' => 'Failed to create cycle',

    // __________ PROMO CONFIG __________
    'promo_config' => [
        'retrieved'      => 'Promo configuration retrieved successfully.',
        'retrieve_failed'=> 'Failed to retrieve promo configuration.',
        'updated'        => 'Promo configuration updated successfully.',
        'update_failed'  => 'Failed to update promo configuration.',
    ],

    // __________ DISCOUNT TEMPLATES __________
    'discount_template' => [
        'retrieved'      => 'Discount templates retrieved successfully.',
        'retrieve_failed'=> 'Failed to retrieve discount templates.',
        'created'        => 'Discount template created successfully.',
        'create_failed'  => 'Failed to create discount template.',
        'updated'        => 'Discount template updated successfully.',
        'update_failed'  => 'Failed to update discount template.',
        'deleted'        => 'Discount template deleted successfully.',
        'delete_failed'  => 'Failed to delete discount template.',
        'not_found'      => 'Discount template not found.',
    ],

    // __________ BLOCKED SLOTS __________
    'blocked_slots' => [
        'retrieved'      => 'Blocked slots retrieved successfully.',
        'retrieve_failed'=> 'Failed to retrieve blocked slots.',
        'created'        => 'Slot blocked successfully.',
        'create_failed'  => 'Failed to block slot.',
        'deleted'        => 'Blocked slot removed successfully.',
        'delete_failed'  => 'Failed to remove blocked slot.',
    ],

    // __________ DRAFT SESSION __________
    'draft_session_created'          => 'Draft session created successfully.',
    'draft_session_restored'         => 'Draft session restored successfully.',
    'draft_interaction_logged'       => 'Interaction recorded.',
    'draft_interaction_limit_reached'=> 'You have reached the free limit for this feature. Please complete your account to continue.',
    'draft_session_completed'        => 'Account created successfully. A verification code has been sent to your phone.',
];
