<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    /**
     * Display a listing of the books.
     */
    public function index(): Response
    {
        $books = Book::query()
            ->with(['category:id,name'])
            ->latest()
            ->get()
            ->map(fn (Book $book) => [
                'id' => $book->id,
                'title' => $book->title,
                'slug' => $book->slug,
                'author' => $book->author,
                'publisher' => $book->publisher,
                'isbn' => $book->isbn,
                'category' => $book->category?->name,
                'price_normal' => (float) $book->price_normal,
                'price_discount' => $book->price_discount !== null ? (float) $book->price_discount : null,
                'cover_url' => $this->resolveCoverUrl($book->cover),
                'is_published' => $book->is_published,
                'created_at' => $book->created_at?->format('d M Y'),
            ]);

        return Inertia::render('Admin/Books/Index', [
            'books' => $books,
        ]);
    }

    /**
     * Show the form for creating a new book.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Books/Create', [
            'categories' => $this->getCategoryOptions(),
        ]);
    }

    /**
     * Store a newly created book in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateBook($request);
        $coverPath = $this->storeCover($request);

        Book::create([
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'slug' => $this->generateUniqueSlug($validated['title']),
            'author' => $validated['author'],
            'publisher' => $validated['publisher'] ?? null,
            'isbn' => $validated['isbn'] ?? null,
            'price_normal' => $validated['price_normal'],
            'price_discount' => $validated['price_discount'] ?? null,
            'cover' => $coverPath,
            'drive_link' => $validated['drive_link'],
            'description' => $validated['description'] ?? null,
            'is_published' => $request->boolean('is_published'),
        ]);

        return redirect()
            ->route('admin.books.index')
            ->with('success', 'Buku berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified book.
     */
    public function edit(Book $book): Response
    {
        return Inertia::render('Admin/Books/Edit', [
            'book' => [
                'id' => $book->id,
                'category_id' => $book->category_id,
                'title' => $book->title,
                'author' => $book->author,
                'publisher' => $book->publisher,
                'isbn' => $book->isbn,
                'price_normal' => (string) $book->price_normal,
                'price_discount' => $book->price_discount !== null ? (string) $book->price_discount : '',
                'cover_url' => $this->resolveCoverUrl($book->cover),
                'drive_link' => $book->drive_link,
                'description' => $book->description,
                'is_published' => $book->is_published,
            ],
            'categories' => $this->getCategoryOptions($book->category_id),
        ]);
    }

    /**
     * Update the specified book in storage.
     */
    public function update(Request $request, Book $book): RedirectResponse
    {
        $validated = $this->validateBook($request);
        $coverPath = $this->storeCover($request, $book->cover);

        $book->update([
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'slug' => $book->title !== $validated['title']
                ? $this->generateUniqueSlug($validated['title'], $book->id)
                : $book->slug,
            'author' => $validated['author'],
            'publisher' => $validated['publisher'] ?? null,
            'isbn' => $validated['isbn'] ?? null,
            'price_normal' => $validated['price_normal'],
            'price_discount' => $validated['price_discount'] ?? null,
            'cover' => $coverPath,
            'drive_link' => $validated['drive_link'],
            'description' => $validated['description'] ?? null,
            'is_published' => $request->boolean('is_published'),
        ]);

        return redirect()
            ->route('admin.books.index')
            ->with('success', 'Buku berhasil diperbarui.');
    }

    /**
     * Soft delete the specified book.
     */
    public function destroy(Book $book): RedirectResponse
    {
        $book->delete();

        return redirect()
            ->route('admin.books.index')
            ->with('success', 'Buku berhasil dihapus.');
    }

    /**
     * Return category options for forms.
     */
    protected function getCategoryOptions(?int $selectedCategoryId = null): array
    {
        return Category::query()
            ->where(function ($query) use ($selectedCategoryId) {
                $query->where('is_active', true);

                if ($selectedCategoryId) {
                    $query->orWhere('id', $selectedCategoryId);
                }
            })
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
            ])
            ->all();
    }

    /**
     * Validate an incoming book request.
     */
    protected function validateBook(Request $request): array
    {
        return $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'publisher' => ['nullable', 'string', 'max:255'],
            'isbn' => ['nullable', 'string', 'max:100'],
            'price_normal' => ['required', 'numeric', 'min:0'],
            'price_discount' => ['nullable', 'numeric', 'min:0', 'lte:price_normal'],
            'cover' => ['nullable', 'image', 'max:2048'],
            'drive_link' => ['required', 'url', 'max:2048'],
            'description' => ['nullable', 'string'],
            'is_published' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * Store a cover image and return its relative path.
     */
    protected function storeCover(Request $request, ?string $currentCover = null): ?string
    {
        if (! $request->hasFile('cover')) {
            return $currentCover;
        }

        if ($currentCover) {
            Storage::disk('public')->delete($currentCover);
        }

        return $request->file('cover')->store('books/covers', 'public');
    }

    /**
     * Resolve a stored cover path into a browser-friendly URL.
     */
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

    /**
     * Generate a unique slug for a book.
     */
    protected function generateUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $slug = Str::slug($value);
        $baseSlug = $slug !== '' ? $slug : 'buku';
        $counter = 1;

        while (
            Book::query()
                ->withTrashed()
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->where('slug', $slug = $counter === 1 ? $baseSlug : "{$baseSlug}-{$counter}")
                ->exists()
        ) {
            $counter++;
        }

        return $slug;
    }
}
