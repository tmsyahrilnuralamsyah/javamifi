<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to Google.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->redirect();
    }

    /**
     * Handle the callback from Google.
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (Throwable) {
            return redirect()
                ->route('login')
                ->with('error', 'Login dengan Google gagal. Silakan coba lagi.');
        }

        $user = User::query()
            ->where('google_id', $googleUser->id)
            ->orWhere('email', $googleUser->email)
            ->first();

        if ($user) {
            $user->forceFill([
                'name' => $googleUser->name ?: $user->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'email_verified_at' => $user->email_verified_at ?? now(),
                'role' => $user->role ?: 'admin',
            ])->save();
        } else {
            $user = User::create([
                'name' => $googleUser->name ?: 'Google User',
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'email_verified_at' => now(),
                'role' => 'admin',
                'password' => Str::password(32),
            ]);
        }

        Auth::login($user, true);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
