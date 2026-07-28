<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function index(Request $request): Response
    {
        $categorySlug = trim((string) $request->string('category'));
        $ownedBookIds = $request->user()
            ? $request->user()->userBooks()->pluck('book_id')->all()
            : [];

        $categories = Category::query()
            ->where('is_active', true)
            ->withCount([
                'books as books_count' => fn ($query) => $query->where('is_published', true),
            ])
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'books_count' => (int) $category->books_count,
            ])
            ->values();

        $books = Book::query()
            ->with('category:id,name,slug')
            ->where('is_published', true)
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->when($categorySlug !== '', fn ($query) => $query->whereHas(
                'category',
                fn ($categoryQuery) => $categoryQuery
                    ->where('slug', $categorySlug)
                    ->where('is_active', true),
            ))
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Book $book) => $this->transformBookCard($book, $ownedBookIds));

        return Inertia::render('Storefront/Index', [
            'filters' => [
                'category' => $categorySlug,
            ],
            'categories' => $categories,
            'books' => $books,
        ]);
    }

    public function show(Book $book, Request $request): Response
    {
        abort_unless($book->is_published, 404);
        $ownedBookIds = $request->user()
            ? $request->user()->userBooks()->pluck('book_id')->all()
            : [];

        $book->load('category:id,name,slug');

        $relatedBooks = Book::query()
            ->with('category:id,name,slug')
            ->where('is_published', true)
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->where('id', '!=', $book->id)
            ->where('category_id', $book->category_id)
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn (Book $relatedBook) => $this->transformBookCard($relatedBook, $ownedBookIds))
            ->values();

        return Inertia::render('Storefront/Show', [
            'book' => [
                'id' => $book->id,
                'title' => $book->title,
                'slug' => $book->slug,
                'author' => $book->author,
                'publisher' => $book->publisher,
                'isbn' => $book->isbn,
                'description' => $book->description,
                'cover_url' => $this->resolveCoverUrl($book->cover),
                'price_normal' => (float) $book->price_normal,
                'price_discount' => $book->price_discount !== null ? (float) $book->price_discount : null,
                'final_price' => (float) ($book->price_discount ?: $book->price_normal),
                'category' => $book->category ? [
                    'name' => $book->category->name,
                    'slug' => $book->category->slug,
                ] : null,
                'is_owned' => in_array($book->id, $ownedBookIds, true),
            ],
            'relatedBooks' => $relatedBooks,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $query = trim((string) $request->string('q'));

        if (mb_strlen($query) < 2) {
            return response()->json([
                'data' => [],
            ]);
        }

        $books = Book::query()
            ->with('category:id,name,slug')
            ->where('is_published', true)
            ->whereHas('category', fn ($categoryQuery) => $categoryQuery->where('is_active', true))
            ->where(function ($bookQuery) use ($query) {
                $bookQuery
                    ->where('title', 'like', "%{$query}%")
                    ->orWhere('author', 'like', "%{$query}%")
                    ->orWhereHas('category', fn ($categoryQuery) => $categoryQuery
                        ->where('is_active', true)
                        ->where('name', 'like', "%{$query}%"));
            })
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn (Book $book) => [
                'id' => $book->id,
                'title' => $book->title,
                'slug' => $book->slug,
                'author' => $book->author,
                'category' => $book->category?->name,
                'cover_url' => $this->resolveCoverUrl($book->cover),
                'url' => route('storefront.books.show', $book->slug),
            ])
            ->values();

        return response()->json([
            'data' => $books,
        ]);
    }

    protected function transformBookCard(Book $book, array $ownedBookIds = []): array
    {
        return [
            'id' => $book->id,
            'title' => $book->title,
            'slug' => $book->slug,
            'author' => $book->author,
            'description' => Str::limit(strip_tags((string) $book->description), 140),
            'cover_url' => $this->resolveCoverUrl($book->cover),
            'price_normal' => (float) $book->price_normal,
            'price_discount' => $book->price_discount !== null ? (float) $book->price_discount : null,
            'final_price' => (float) ($book->price_discount ?: $book->price_normal),
            'category' => $book->category ? [
                'name' => $book->category->name,
                'slug' => $book->category->slug,
            ] : null,
            'detail_url' => route('storefront.books.show', $book->slug),
            'is_owned' => in_array($book->id, $ownedBookIds, true),
        ];
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
