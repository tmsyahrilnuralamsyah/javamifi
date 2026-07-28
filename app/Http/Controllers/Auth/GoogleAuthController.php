<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use Illuminate\Http\RedirectResponse;
use Throwable;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to Google.
     */
    public function redirect(): RedirectResponse
    {
        return $this->googleProvider()
            ->stateless()
            ->redirect();
    }

    /**
     * Handle the callback from Google.
     */
    public function callback(): RedirectResponse
    {
        try {
            /** @var SocialiteUser $googleUser */
            $googleUser = $this->googleProvider()
                ->stateless()
                ->user();
        } catch (Throwable) {
            return redirect()
                ->route('login')
                ->with('error', 'Login dengan Google gagal. Silakan coba lagi.');
        }

        $googleId = (string) $googleUser->getId();
        $googleEmail = $googleUser->getEmail();
        $googleName = $googleUser->getName();

        if (! $googleEmail) {
            return redirect()
                ->route('login')
                ->with('error', 'Akun Google kamu tidak memiliki email yang bisa digunakan untuk login.');
        }

        /** @var User|null $user */
        $user = User::query()
            ->where('google_id', $googleId)
            ->orWhere('email', $googleEmail)
            ->first();

        if ($user) {
            $user->forceFill([
                'name' => $googleName ?: $user->name,
                'email' => $googleEmail,
                'google_id' => $googleId,
                'role' => $user->role ?: 'customer',
            ])->save();
        } else {
            $user = User::create([
                'name' => $googleName ?: 'Google User',
                'email' => $googleEmail,
                'google_id' => $googleId,
                'role' => 'customer',
                'password' => (string) Str::password(32),
            ]);
        }

        Auth::login($user, true);

        $defaultRoute = $user->role === 'admin'
            ? route('dashboard', absolute: false)
            : route('storefront.index', absolute: false);

        return redirect()->intended($defaultRoute);
    }

    protected function googleProvider(): GoogleProvider
    {
        /** @var GoogleProvider $provider */
        $provider = Socialite::driver('google');

        return $provider;
    }
}
