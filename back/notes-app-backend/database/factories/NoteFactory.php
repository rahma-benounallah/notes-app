<?php

namespace Database\Factories;

use App\Models\Note;
use Illuminate\Database\Eloquent\Factories\Factory;

class NoteFactory extends Factory
{
    protected $model = Note::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence(5),
            'content' => $this->faker->paragraphs(2, true),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
        ];
    }
}
