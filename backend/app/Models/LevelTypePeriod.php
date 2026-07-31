<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class LevelTypePeriod extends Model
{
    use HasFactory;

    protected $fillable = ['level_type_id', 'name', 'from', 'to', 'order'];

    public function levelType(): BelongsTo
    {
        return $this->belongsTo(LevelType::class);
    }
}
