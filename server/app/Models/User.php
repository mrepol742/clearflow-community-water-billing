<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

#[
    Fillable([
        "ulid",
        "first_name",
        "middle_name",
        "last_name",
        "email",
        "phone_number",
        "block_number",
        "password",
        "lot_number",
        "street_name",
        "recent_billing_amount",
    ]),
]
#[Hidden(["id", "password", "remember_token"])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use SoftDeletes, HasFactory, Notifiable;

    /**
     * Boot the model.
     *
     * @return void
     */
    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (
                Schema::hasColumn($model->getTable(), "ulid") &&
                empty($model->ulid)
            ) {
                $model->ulid = (string) Str::ulid();
            }
        });
    }

    /**
     * Get the water bills associated with this user.
     *
     * @return HasMany
     */
    public function waterBills(): HasMany
    {
        return $this->hasMany(WaterBill::class, "resident_ulid")->withTrashed();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            "email_verified_at" => "datetime",
            "phone_number_verified_at" => "datetime",
            "password" => "hashed",
        ];
    }
}
