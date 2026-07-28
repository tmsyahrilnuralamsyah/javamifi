<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MyOrderController extends Controller
{
    public function __construct(
        protected MidtransService $midtransService,
    ) {
    }

    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->with(['items', 'payment'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total_items' => $order->items->count(),
                'grand_total' => (float) $order->grand_total,
                'payment_number' => $order->payment?->payment_number,
                'payment_status' => $order->payment?->transaction_status,
                'created_at' => $order->created_at?->format('d M Y H:i'),
                'paid_at' => $order->paid_at?->format('d M Y H:i'),
                'detail_url' => route('customer.my-orders.show', ['order' => $order->order_number]),
            ])
            ->values();

        return Inertia::render('Customer/MyOrders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $this->authorizeOrder($request, $order);

        $order->load(['items.book.category:id,name,slug', 'payment']);

        return Inertia::render('Customer/MyOrders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'subtotal' => (float) $order->subtotal,
                'discount_total' => (float) $order->discount_total,
                'grand_total' => (float) $order->grand_total,
                'created_at' => $order->created_at?->format('d M Y H:i'),
                'paid_at' => $order->paid_at?->format('d M Y H:i'),
                'can_pay' => in_array($order->status, ['pending', 'failed'], true),
                'payment' => $order->payment ? [
                    'payment_number' => $order->payment->payment_number,
                    'payment_type' => $order->payment->payment_type,
                    'transaction_status' => $order->payment->transaction_status,
                    'snap_token' => $order->payment->snap_token,
                    'snap_redirect_url' => $order->payment->snap_redirect_url,
                    'paid_at' => $order->payment->paid_at?->format('d M Y H:i'),
                ] : null,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'book_title' => $item->book_title,
                    'author' => $item->book?->author,
                    'cover_url' => $this->resolveCoverUrl($item->book?->cover),
                    'detail_url' => $item->book?->slug
                        ? route('storefront.books.show', $item->book->slug)
                        : null,
                    'price_normal' => (float) $item->price_normal,
                    'price_discount' => $item->price_discount !== null ? (float) $item->price_discount : null,
                    'final_price' => (float) $item->final_price,
                ])->values(),
            ],
        ]);
    }

    public function pay(Request $request, Order $order): JsonResponse
    {
        $this->authorizeOrder($request, $order);

        $order->load(['items', 'payment']);

        abort_unless($order->payment, 404);
        abort_if(! in_array($order->status, ['pending', 'failed'], true), 422, 'Pesanan ini sudah tidak bisa dibayar ulang.');

        try {
            if (! $order->payment->snap_token) {
                $transaction = $this->midtransService->createTransaction([
                    'transaction_details' => [
                        'order_id' => $order->payment->payment_number,
                        'gross_amount' => (int) round($order->grand_total),
                    ],
                    'item_details' => $order->items->map(fn ($item) => [
                        'id' => (string) ($item->book_id ?: $item->id),
                        'price' => (int) round($item->final_price),
                        'quantity' => 1,
                        'name' => Str::limit($item->book_title, 50, ''),
                    ])->values()->all(),
                    'customer_details' => [
                        'first_name' => $request->user()->name,
                        'email' => $request->user()->email,
                    ],
                    'callbacks' => [
                        'finish' => route('payments.midtrans.finish'),
                        'pending' => route('payments.midtrans.pending'),
                        'error' => route('payments.midtrans.error'),
                    ],
                ]);

                $order->payment->forceFill([
                    'snap_token' => $transaction['token'] ?? null,
                    'snap_redirect_url' => $transaction['redirect_url'] ?? null,
                ])->save();
            }

            return response()->json([
                'message' => 'Token pembayaran berhasil disiapkan.',
                'data' => [
                    'snap_token' => $order->payment->fresh()->snap_token,
                    'snap_redirect_url' => $order->payment->fresh()->snap_redirect_url,
                    'my_books_url' => route('customer.my-books.index'),
                    'order_url' => route('customer.my-orders.show', ['order' => $order->order_number]),
                ],
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Pembayaran belum bisa diproses. Silakan coba lagi beberapa saat lagi.',
            ], 500);
        }
    }

    protected function authorizeOrder(Request $request, Order $order): void
    {
        abort_unless(
            $request->user()->role === 'admin' || $order->user_id === $request->user()->id,
            403,
        );
    }

    protected function resolveCoverUrl(?string $cover): ?string
    {
        if (! $cover) {
            return null;
        }

        if (Str::startsWith($cover, ['http://', 'https://', '/'])) {
            return $cover;
        }

        return '/storage/'.$cover;
    }
}
