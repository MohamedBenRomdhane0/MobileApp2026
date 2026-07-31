<?php

namespace App\Models;

use App\Enum\DiscountKindEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MeetingGroupPromo extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'meeting_group_id',
        'discount_template_id',
        'kind',
        'discount_value',
        'condition_value',
        'condition_unit',
        'condition_start_date',
        'condition_end_date',
    ];

    protected $casts = [
        'kind'                 => DiscountKindEnum::class,
        'discount_value'       => 'decimal:2',
        'condition_value'      => 'decimal:2',
        'condition_start_date' => 'date',
        'condition_end_date'   => 'date',
    ];

    public function group()
    {
        return $this->belongsTo(MeetingGroup::class, 'meeting_group_id');
    }

    public function discountTemplate()
    {
        return $this->belongsTo(DiscountTemplate::class);
    }
}
