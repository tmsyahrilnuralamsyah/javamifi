<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_screen_is_not_available(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertNotFound();
    }

    public function test_reset_password_submission_is_not_available(): void
    {
        $response = $this->post('/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertNotFound();
    }
}
