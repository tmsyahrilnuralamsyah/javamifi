import { Link, router } from '@inertiajs/react';
import { formatCurrency } from '@/utils/format';

export default function BookCard({ book }) {
    const addToCart = () => {
        router.post(
            route('cart.store'),
            { book_id: book.id },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
            <Link href={book.detail_url} className="block">
                <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                    {book.cover_url ? (
                        <img
                            src={book.cover_url}
                            alt={book.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                            No Cover
                        </div>
                    )}
                </div>
            </Link>

            <div className="space-y-4 p-5">
                <div className="space-y-2">
                    {book.category?.name && (
                        <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                            {book.category.name}
                        </span>
                    )}

                    <div>
                        <Link href={book.detail_url} className="text-lg font-semibold text-slate-950 transition hover:text-sky-700">
                            {book.title}
                        </Link>
                        <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                    </div>

                    <p className="text-sm leading-6 text-slate-500">{book.description}</p>
                </div>

                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xl font-semibold text-slate-950">
                            {formatCurrency(book.final_price)}
                        </p>
                        {book.price_discount && (
                            <p className="mt-1 text-sm text-slate-400 line-through">
                                {formatCurrency(book.price_normal)}
                            </p>
                        )}
                    </div>

                    {book.is_owned ? (
                        <Link
                            href={route('customer.my-books.index')}
                            className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
                        >
                            Sudah Dibeli
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={addToCart}
                            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            + Keranjang
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
