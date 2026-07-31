<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TrialSetting extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'free_trial_seconds',
        'trial_enabled',
    ];

    protected $casts = [
        'free_trial_seconds' => 'integer',
        'trial_enabled'      => 'boolean',
    ];

}