<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Support\CartManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $books = CartManager::books($request);
        $ownedIds = $request->user()
            ? $request->user()->userBooks()->pluck('book_id')->all()
            : [];

        $items = $books->map(fn (Book $book) => [
            'id' => $book->id,
            'title' => $book->title,
            'slug' => $book->slug,
            'author' => $book->author,
            'cover_url' => $this->resolveCoverUrl($book->cover),
            'category' => $book->category?->name,
            'price_normal' => (float) $book->price_normal,
            'price_discount' => $book->price_discount !== null ? (float) $book->price_discount : null,
            'final_price' => (float) ($book->price_discount ?: $book->price_normal),
            'detail_url' => route('storefront.books.show', $book->slug),
            'is_owned' => in_array($book->id, $ownedIds, true),
        ])->values();

        return Inertia::render('Cart/Index', [
            'items' => $items,
            'summary' => [
                'total_items' => $items->count(),
                'total_amount' => (float) $items
                    ->where('is_owned', false)
                    ->sum('final_price'),
                'owned_items' => $items->where('is_owned', true)->count(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'book_id' => ['required', 'integer'],
        ]);

        $book = Book::query()
            ->whereKey($validated['book_id'])
            ->where('is_published', true)
            ->firstOrFail();

        if ($request->user()?->userBooks()->where('book_id', $book->id)->exists()) {
            return back()->with('error', 'Buku ini sudah pernah kamu beli dan sudah tersedia di Buku Saya.');
        }

        CartManager::add($request, $book->id);

        return back()->with('success', sprintf('"%s" berhasil ditambahkan ke keranjang.', $book->title));
    }

    public function destroy(Request $request, int $bookId): RedirectResponse
    {
        CartManager::remove($request, $bookId);

        return back()->with('success', 'Buku berhasil dihapus dari keranjang.');
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
