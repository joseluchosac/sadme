<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sku' => $this->faker->unique()->word(),
            'name' => Str::limit($this->faker->unique()->sentence(), 50, ''),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 1, 1000),
        ];
    }
}
