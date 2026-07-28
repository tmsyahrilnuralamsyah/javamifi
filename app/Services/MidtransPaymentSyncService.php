<?php

namespace App\Services;

use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Throwable;

class MidtransPaymentSyncService
{
    public function __construct(
        protected N8nPaymentExportService $n8nPaymentExportService,
    ) {
    }

    public function syncByPaymentNumber(string $paymentNumber, array $payload): ?Payment
    {
        $payment = Payment::query()
            ->with(['order.items', 'order.userBooks', 'order.user'])
            ->where('payment_number', $paymentNumber)
            ->first();

        if (! $payment) {
            return null;
        }

        DB::transaction(function () use ($payload, $payment) {
            $transactionStatus = (string) ($payload['transaction_status'] ?? 'pending');
            $fraudStatus = (string) ($payload['fraud_status'] ?? '');
            $orderStatus = $this->resolveOrderStatus($transactionStatus, $fraudStatus);
            $paidAt = $this->resolvePaidAt($payload, $orderStatus);

            $payment->forceFill([
                'payment_type' => $payload['payment_type'] ?? $payment->payment_type,
                'transaction_status' => $transactionStatus,
                'paid_at' => $paidAt,
            ])->save();

            $payment->order->forceFill([
                'status' => $orderStatus,
                'paid_at' => $paidAt,
            ])->save();

            if ($orderStatus === 'paid') {
                foreach ($payment->order->items as $item) {
                    $payment->order->userBooks()->firstOrCreate(
                        [
                            'user_id' => $payment->order->user_id,
                            'book_id' => $item->book_id,
                        ],
                        [
                            'purchased_at' => $paidAt ?? now(),
                        ],
                    );
                }

                DB::afterCommit(function () use ($payment) {
                    try {
                        $this->n8nPaymentExportService->exportPaidPayment(
                            $payment->fresh(['order.user'])
                        );
                    } catch (Throwable $exception) {
                        report($exception);
                    }
                });
            }
        });

        return $payment->fresh(['order', 'order.items', 'order.userBooks', 'order.user']);
    }

    protected function resolveOrderStatus(string $transactionStatus, string $fraudStatus): string
    {
        return match ($transactionStatus) {
            'settlement' => 'paid',
            'capture' => $fraudStatus === 'challenge' ? 'pending' : 'paid',
            'pending' => 'pending',
            'expire' => 'expired',
            'cancel' => 'cancelled',
            'deny', 'failure' => 'failed',
            default => 'pending',
        };
    }

    protected function resolvePaidAt(array $payload, string $orderStatus): ?Carbon
    {
        if ($orderStatus !== 'paid') {
            return null;
        }

        $value = $payload['settlement_time'] ?? $payload['transaction_time'] ?? null;

        return $value ? Carbon::parse($value) : now();
    }
}
