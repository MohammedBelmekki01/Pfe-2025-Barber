<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Barber;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => '123456789',
            'addrees' => 'casa',
            'phone' => '0612345678',
        ]);



        Admin::factory()->create([
            'firstname' => 'Super',
            'lastname' => 'Admin',
            'date_of_birth' => '1990-01-01',
            'gender' => 'm',
            'addrees' => '123 Admin Street',
            'phone' => '0612345678',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
        ]);


        Barber::factory()->create([
            'firstname'    => 'barber111',
            'lastname'     => 'barber111',
            'date_of_birth' => '1985-05-15',
            'gender'       => 'm',
            'addrees'      => '456 Barber Ave',
            'phone'        => '0698865432',
            'email'        => 'barber111@example.com',
            'password' => Hash::make('barber123456'),
            'bio'          => 'Experienced barber with a passion for style.',
            'experience'   => '10 years',
            'location'     => 'Casablanca',
        ]);
    }
}
