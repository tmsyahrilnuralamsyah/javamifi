<?php

namespace App\Services;

use App\Models\Payment;
use Illuminate\Support\Facades\Http;

class N8nPaymentExportService
{
    public function exportPaidPayment(Payment $payment): void
    {
        $webhookUrl = (string) config('services.n8n.payments_webhook_url');

        if ($webhookUrl === '') {
            return;
        }

        $payment->loadMissing('order.user');

        if (
            $payment->exported_to_sheet_at !== null
            || $payment->paid_at === null
            || ! in_array($payment->transaction_status, ['settlement', 'capture'], true)
            || ! $payment->order
            || ! $payment->order->user
        ) {
            return;
        }

        Http::asJson()
            ->acceptJson()
            ->timeout(10)
            ->retry(2, 500)
            ->post($webhookUrl, [
                'paid_at' => $payment->paid_at->format('Y-m-d H:i:s'),
                'payment_number' => $payment->payment_number,
                'order_number' => $payment->order->order_number,
                'customer_name' => $payment->order->user->name,
                'customer_email' => $payment->order->user->email,
                'gross_amount' => (float) $payment->gross_amount,
                'payment_type' => $payment->payment_type,
                'transaction_status' => $payment->transaction_status,
            ])
            ->throw();

        $payment->forceFill([
            'exported_to_sheet_at' => now(),
        ])->save();
    }
}
