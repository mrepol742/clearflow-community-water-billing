<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as EloquentModel;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

#[Hidden(["id", "created_at", "updated_at"])]
class Model extends EloquentModel
{
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
     * Get the hidden attributes for serialization.
     *
     * @return array
     */
    public function getHidden(): array
    {
        return array_unique(array_merge(parent::getHidden(), $this->hidden));
    }

    /**
     * Get the route key name for Laravel route model binding.
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return "ulid";
    }
}
