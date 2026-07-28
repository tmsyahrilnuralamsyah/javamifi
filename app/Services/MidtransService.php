<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MidtransService
{
    public function createTransaction(array $payload): array
    {
        $response = Http::withBasicAuth((string) config('services.midtrans.server_key'), '')
            ->acceptJson()
            ->post($this->baseUrl().'/snap/v1/transactions', $payload)
            ->throw();

        return $response->json();
    }

    public function getTransactionStatus(string $paymentNumber): array
    {
        $response = Http::withBasicAuth((string) config('services.midtrans.server_key'), '')
            ->acceptJson()
            ->get($this->apiBaseUrl().'/v2/'.$paymentNumber.'/status')
            ->throw();

        return $response->json();
    }

    public function verifyNotificationSignature(array $payload): bool
    {
        $expected = hash(
            'sha512',
            sprintf(
                '%s%s%s%s',
                $payload['order_id'] ?? '',
                $payload['status_code'] ?? '',
                $payload['gross_amount'] ?? '',
                (string) config('services.midtrans.server_key'),
            ),
        );

        return hash_equals($expected, (string) ($payload['signature_key'] ?? ''));
    }

    public function snapScriptUrl(): string
    {
        return $this->isProduction()
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js';
    }

    protected function baseUrl(): string
    {
        return $this->isProduction()
            ? 'https://app.midtrans.com'
            : 'https://app.sandbox.midtrans.com';
    }

    protected function apiBaseUrl(): string
    {
        return $this->isProduction()
            ? 'https://api.midtrans.com'
            : 'https://api.sandbox.midtrans.com';
    }

    protected function isProduction(): bool
    {
        return (bool) config('services.midtrans.is_production');
    }
}
