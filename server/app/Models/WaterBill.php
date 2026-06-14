<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[
    Fillable([
        "ulid",
        "resident_ulid",
        "period",
        "previous_reading",
        "current_reading",
        "amount",
        "due_date",
    ]),
]
class WaterBill extends Model
{
    /** @use HasFactory<WaterBillFactory> */
    use SoftDeletes, HasFactory;

    public const PERIODS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    /**
     * Get the resident that owns the water bill.
     *
     * @return BelongsTo
     */
    public function resident(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            "resident_ulid",
            "ulid",
        )->withTrashed();
    }
}
