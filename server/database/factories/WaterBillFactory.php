<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WaterBill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WaterBill>
 */
class WaterBillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "resident_ulid" => User::factory(),
            "period" => fake()->randomElement(WaterBill::PERIODS),
            "previous_reading" => fake()->randomFloat(2, 0, 100),
            "current_reading" => fake()->randomFloat(2, 0, 100),
            "amount" => fake()->randomFloat(2, 0, 100),
            "due_date" => fake()->date(),
        ];
    }
}
