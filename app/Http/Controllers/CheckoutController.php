<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Order;
use App\Models\Payment;
use App\Services\MidtransService;
use App\Support\CartManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CheckoutController extends Controller
{
    public function __construct(
        protected MidtransService $midtransService,
    ) {
    }

    public function create(Request $request): Response
    {
        $cartBooks = CartManager::books($request);
        $ownedIds = $request->user()->userBooks()->pluck('book_id')->all();

        $ownedItems = $cartBooks
            ->filter(fn (Book $book) => in_array($book->id, $ownedIds, true))
            ->values();

        if ($ownedItems->isNotEmpty()) {
            CartManager::forget($request, $ownedItems->pluck('id')->all());
        }

        $checkoutItems = $cartBooks
            ->reject(fn (Book $book) => in_array($book->id, $ownedIds, true))
            ->map(fn (Book $book) => [
                'id' => $book->id,
                'title' => $book->title,
                'slug' => $book->slug,
                'author' => $book->author,
                'cover_url' => $this->resolveCoverUrl($book->cover),
                'final_price' => $this->resolveFinalPrice($book),
                'price_normal' => (float) $book->price_normal,
                'price_discount' => $book->price_discount !== null ? (float) $book->price_discount : null,
                'detail_url' => route('storefront.books.show', $book->slug),
            ])
            ->values();

        return Inertia::render('Checkout/Index', [
            'items' => $checkoutItems,
            'removedOwnedItems' => $ownedItems
                ->map(fn (Book $book) => [
                    'id' => $book->id,
                    'title' => $book->title,
                ])
                ->values(),
            'summary' => [
                'total_items' => $checkoutItems->count(),
                'total_amount' => (float) $checkoutItems->sum('final_price'),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $cartBooks = CartManager::books($request);
        $ownedIds = $request->user()->userBooks()->pluck('book_id')->all();
        $checkoutBooks = $cartBooks
            ->reject(fn (Book $book) => in_array($book->id, $ownedIds, true))
            ->values();

        if ($ownedIds !== []) {
            CartManager::forget($request, $ownedIds);
        }

        abort_if($checkoutBooks->isEmpty(), 422, 'Keranjang checkout kosong. Tambahkan buku terlebih dahulu.');

        $orderNumber = $this->generateOrderNumber();
        $paymentNumber = $this->generatePaymentNumber();
        $totalAmount = (int) round($checkoutBooks->sum(fn (Book $book) => $this->resolveFinalPrice($book)));

        $payload = [
            'transaction_details' => [
                'order_id' => $paymentNumber,
                'gross_amount' => $totalAmount,
            ],
            'item_details' => $checkoutBooks
                ->map(fn (Book $book) => [
                    'id' => (string) $book->id,
                    'price' => (int) round($this->resolveFinalPrice($book)),
                    'quantity' => 1,
                    'name' => Str::limit($book->title, 50, ''),
                ])
                ->values()
                ->all(),
            'customer_details' => [
                'first_name' => $request->user()->name,
                'email' => $request->user()->email,
            ],
            'callbacks' => [
                'finish' => route('payments.midtrans.finish'),
                'pending' => route('payments.midtrans.pending'),
                'error' => route('payments.midtrans.error'),
            ],
        ];

        try {
            $midtransTransaction = $this->midtransService->createTransaction($payload);

            $order = DB::transaction(function () use ($request, $checkoutBooks, $midtransTransaction, $orderNumber, $paymentNumber, $totalAmount) {
                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'order_number' => $orderNumber,
                    'subtotal' => $totalAmount,
                    'discount_total' => 0,
                    'grand_total' => $totalAmount,
                    'status' => 'pending',
                ]);

                foreach ($checkoutBooks as $book) {
                    $order->items()->create([
                        'book_id' => $book->id,
                        'book_title' => $book->title,
                        'price_normal' => $book->price_normal,
                        'price_discount' => $book->price_discount,
                        'final_price' => $this->resolveFinalPrice($book),
                    ]);
                }

                Payment::create([
                    'order_id' => $order->id,
                    'payment_number' => $paymentNumber,
                    'payment_type' => null,
                    'snap_token' => $midtransTransaction['token'] ?? null,
                    'snap_redirect_url' => $midtransTransaction['redirect_url'] ?? null,
                    'gross_amount' => $totalAmount,
                    'transaction_status' => 'pending',
                ]);

                return $order->load('payment');
            });

            CartManager::forget($request, $checkoutBooks->pluck('id')->all());

            return response()->json([
                'message' => 'Checkout berhasil dibuat. Silakan lanjutkan pembayaran.',
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'payment_number' => $order->payment?->payment_number,
                    'snap_token' => $order->payment?->snap_token,
                    'snap_redirect_url' => $order->payment?->snap_redirect_url,
                    'my_books_url' => route('customer.my-books.index'),
                    'my_orders_url' => route('customer.my-orders.index'),
                    'order_url' => route('customer.my-orders.show', ['order' => $order->order_number]),
                ],
            ]);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Checkout gagal dibuat. Silakan coba lagi beberapa saat lagi.',
            ], 500);
        }
    }

    protected function resolveFinalPrice(Book $book): float
    {
        return (float) ($book->price_discount ?: $book->price_normal);
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

    protected function generateOrderNumber(): string
    {
        return 'ORD-'.now()->format('ymd').'-'.strtoupper(uniqid());
    }

    protected function generatePaymentNumber(): string
    {
        return 'PAY-'.now()->format('ymd').'-'.strtoupper(uniqid());
    }
}
