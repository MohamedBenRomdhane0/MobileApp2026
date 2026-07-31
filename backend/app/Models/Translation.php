<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Translation extends Model
{
    use HasFactory;

    protected $fillable = ['model_type', 'model_id', 'locale', 'key', 'text'];

    public function model(): MorphTo
    {
        return $this->morphTo();
    }
}
