<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\UserBook;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MyBookController extends Controller
{
    public function index(Request $request): Response
    {
        $books = UserBook::query()
            ->with([
                'book.category:id,name,slug',
                'order:id,order_number',
            ])
            ->where('user_id', $request->user()->id)
            ->latest('purchased_at')
            ->get()
            ->map(fn (UserBook $userBook) => [
                'id' => $userBook->id,
                'title' => $userBook->book?->title,
                'author' => $userBook->book?->author,
                'category' => $userBook->book?->category?->name,
                'cover_url' => $this->resolveCoverUrl($userBook->book?->cover),
                'drive_link' => $userBook->book?->drive_link,
                'detail_url' => $userBook->book?->slug
                    ? route('storefront.books.show', $userBook->book->slug)
                    : null,
                'order_number' => $userBook->order?->order_number,
                'order_url' => $userBook->order
                    ? route('customer.my-orders.show', ['order' => $userBook->order->order_number])
                    : null,
                'purchased_at' => $userBook->purchased_at?->format('d M Y H:i'),
            ])
            ->values();

        return Inertia::render('Customer/MyBooks/Index', [
            'books' => $books,
        ]);
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
