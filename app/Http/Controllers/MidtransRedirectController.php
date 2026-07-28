<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\MidtransPaymentSyncService;
use App\Services\MidtransService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Throwable;

class MidtransRedirectController extends Controller
{
    public function __construct(
        protected MidtransService $midtransService,
        protected MidtransPaymentSyncService $midtransPaymentSyncService,
    ) {
    }

    public function finish(Request $request): RedirectResponse
    {
        return $this->handle($request, 'finish');
    }

    public function pending(Request $request): RedirectResponse
    {
        return $this->handle($request, 'pending');
    }

    public function error(Request $request): RedirectResponse
    {
        return $this->handle($request, 'error');
    }

    protected function handle(Request $request, string $type): RedirectResponse
    {
        $paymentNumber = (string) $request->query('order_id', '');

        if ($paymentNumber === '') {
            return redirect()
                ->route('customer.my-orders.index')
                ->with('error', 'Data pembayaran dari Midtrans belum lengkap.');
        }

        try {
            $payload = $this->midtransService->getTransactionStatus($paymentNumber);
            $payment = $this->midtransPaymentSyncService->syncByPaymentNumber($paymentNumber, $payload);
        } catch (Throwable $exception) {
            report($exception);

            return redirect()
                ->route('customer.my-orders.index')
                ->with('error', 'Status pembayaran belum berhasil disinkronkan. Silakan cek lagi beberapa saat lagi.');
        }

        if (! $payment) {
            return redirect()
                ->route('customer.my-orders.index')
                ->with('error', 'Pembayaran yang dikembalikan Midtrans tidak ditemukan.');
        }

        $this->authorizePayment($request, $payment);

        return match ($payment->order?->status) {
            'paid' => redirect()
                ->route('customer.my-books.index')
                ->with('success', 'Pembayaran berhasil. Ebook kamu sudah masuk ke Buku Saya.'),
            'pending' => redirect()
                ->route('customer.my-orders.show', $payment->order)
                ->with('success', $type === 'finish'
                    ? 'Pembayaran masih diproses. Silakan cek status pesanan beberapa saat lagi.'
                    : 'Pembayaran kamu masih menunggu penyelesaian.'),
            default => redirect()
                ->route('customer.my-orders.show', $payment->order)
                ->with('error', 'Pembayaran belum berhasil diselesaikan. Silakan cek detail pesanan kamu.'),
        };
    }

    protected function authorizePayment(Request $request, Payment $payment): void
    {
        abort_unless(
            $request->user()->role === 'admin' || $payment->order?->user_id === $request->user()->id,
            403,
        );
    }
}
