<?php

namespace App\Http\Middleware;

use App\Services\MidtransService;
use App\Support\CartManager;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $midtransService = app(MidtransService::class);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'cart' => [
                'count' => CartManager::count($request),
            ],
            'app' => [
                'name' => config('app.name', 'Javamifi'),
                'whatsapp_admin_number' => config('services.whatsapp.admin_number'),
            ],
            'midtrans' => [
                'client_key' => config('services.midtrans.client_key'),
                'snap_script_url' => $midtransService->snapScriptUrl(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
