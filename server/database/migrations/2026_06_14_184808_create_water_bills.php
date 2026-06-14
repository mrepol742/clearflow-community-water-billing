<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("bills", function (Blueprint $table) {
            $table->id();
            $table->ulid("ulid")->unique();

            $table
                ->foreignUlid("resident_ulid")
                ->constrained("users", "ulid")
                ->restrictOnDelete();

            $table->string("period");
            $table->string("previous_reading");
            $table->string("current_reading");
            $table->string("amount");
            $table->string("due_date");

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("bills");
    }
};
