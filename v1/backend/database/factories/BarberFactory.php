<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Barber>
 */
class BarberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'firstname'     => $this->faker->firstName(),
            'lastname'      => $this->faker->lastName(),
            'date_of_birth' => $this->faker->date('Y-m-d', '2000-01-01'),
            'gender'        => $this->faker->randomElement(['m', 'f']),
            'addrees'       => $this->faker->address(),
            'phone'         => $this->faker->unique()->numerify('06########'),
            'email'         => $this->faker->unique()->safeEmail(),
            'password'      => Hash::make('password'), // Default hash
            'bio'           => $this->faker->text(150),
            'experience'    => $this->faker->numberBetween(1, 20) . ' years',
            'location'      => $this->faker->city(),
        ];
    }
}
