<?php

namespace App\Support;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class CartManager
{
    public const SESSION_KEY = 'cart.book_ids';

    public static function ids(Request $request): array
    {
        return collect($request->session()->get(self::SESSION_KEY, []))
            ->map(fn ($id) => (int) $id)
            ->filter(fn ($id) => $id > 0)
            ->unique()
            ->values()
            ->all();
    }

    public static function count(Request $request): int
    {
        return count(self::ids($request));
    }

    public static function add(Request $request, int $bookId): void
    {
        $ids = collect(self::ids($request))
            ->push($bookId)
            ->unique()
            ->values()
            ->all();

        $request->session()->put(self::SESSION_KEY, $ids);
    }

    public static function remove(Request $request, int $bookId): void
    {
        $ids = collect(self::ids($request))
            ->reject(fn ($id) => $id === $bookId)
            ->values()
            ->all();

        $request->session()->put(self::SESSION_KEY, $ids);
    }

    public static function forget(Request $request, array $bookIds): void
    {
        $removedIds = collect($bookIds)->map(fn ($id) => (int) $id)->all();

        $ids = collect(self::ids($request))
            ->reject(fn ($id) => in_array($id, $removedIds, true))
            ->values()
            ->all();

        $request->session()->put(self::SESSION_KEY, $ids);
    }

    public static function clear(Request $request): void
    {
        $request->session()->forget(self::SESSION_KEY);
    }

    public static function books(Request $request): Collection
    {
        $ids = self::ids($request);

        if ($ids === []) {
            return collect();
        }

        $books = Book::query()
            ->with('category:id,name,slug')
            ->whereIn('id', $ids)
            ->where('is_published', true)
            ->get()
            ->keyBy('id');

        $ordered = collect($ids)
            ->map(fn ($id) => $books->get($id))
            ->filter()
            ->values();

        if ($ordered->count() !== count($ids)) {
            $request->session()->put(self::SESSION_KEY, $ordered->pluck('id')->all());
        }

        return $ordered;
    }
}
