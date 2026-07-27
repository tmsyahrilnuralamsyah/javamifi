<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's admin user.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@javamifi.test'],
            [
                'name' => 'Administrator',
                'email_verified_at' => now(),
                'role' => 'admin',
                'google_id' => null,
                'password' => Hash::make('password'),
            ],
        );
    }
}
