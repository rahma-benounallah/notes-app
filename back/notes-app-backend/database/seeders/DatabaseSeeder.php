<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Note;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $user->notes()->createMany([
            [
                'title' => 'Bienvenue dans Notes App',
                'content' => 'Voici une note de démonstration. Vous pouvez modifier ou supprimer cette note à volonté.',
                'priority' => 'low',
            ],
            [
                'title' => 'Rappel : Réunion de projet',
                'content' => 'N’oubliez pas la réunion prévue demain à 10h pour discuter des prochaines étapes.',
                'priority' => 'medium',
            ],
            [
                'title' => 'Idée d’article',
                'content' => 'Écrire un article sur l’utilisation de React avec une API Laravel et l’authentification par jeton.',
                'priority' => 'high',
            ],
            [
                'title' => 'Courses',
                'content' => 'Pain, lait, œufs, café et quelques légumes pour la semaine.',
                'priority' => 'low',
            ],
        ]);
    }
}
