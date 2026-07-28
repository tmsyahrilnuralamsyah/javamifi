import BookCard from '@/Components/Storefront/BookCard';
import FlashMessage from '@/Components/Storefront/FlashMessage';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { formatCurrency } from '@/utils/format';

export default function Show({ book, relatedBooks }) {
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
        <CustomerLayout>
            <Head title={book.title} />

            <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                <FlashMessage />

                <div className="grid gap-8 lg:grid-cols-[0.45fr_0.55fr]">
                    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                        <div className="aspect-[4/5] bg-slate-100">
                            {book.cover_url ? (
                                <img
                                    src={book.cover_url}
                                    alt={book.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                                    No Cover
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                        {book.category?.name && (
                            <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">
                                {book.category.name}
                            </span>
                        )}

                        <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-950">
                            {book.title}
                        </h1>
                        <p className="mt-3 text-lg text-slate-500">{book.author}</p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Harga</p>
                                <p className="mt-2 text-xl font-semibold text-slate-950">
                                    {formatCurrency(book.final_price)}
                                </p>
                                {book.price_discount && (
                                    <p className="mt-1 text-sm text-slate-400 line-through">
                                        {formatCurrency(book.price_normal)}
                                    </p>
                                )}
                            </div>
                            <div className="rounded-3xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Publisher</p>
                                <p className="mt-2 text-base font-semibold text-slate-950">
                                    {book.publisher || '-'}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">ISBN</p>
                                <p className="mt-2 text-base font-semibold text-slate-950">
                                    {book.isbn || '-'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-slate-200 pt-8">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                                Deskripsi
                            </p>
                            <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">
                                {book.description || 'Deskripsi buku belum tersedia.'}
                            </p>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            {book.is_owned ? (
                                <Link
                                    href={route('customer.my-books.index')}
                                    className="inline-flex items-center rounded-2xl bg-emerald-100 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
                                >
                                    Buka di Buku Saya
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={addToCart}
                                    className="inline-flex items-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Tambah ke Keranjang
                                </button>
                            )}

                            <Link
                                href={route('cart.index')}
                                className="inline-flex items-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Lihat Keranjang
                            </Link>
                        </div>
                    </div>
                </div>

                <section className="space-y-6">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                            Rekomendasi
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                            Buku lain yang mungkin cocok
                        </h2>
                    </div>

                    {relatedBooks.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                            {relatedBooks.map((relatedBook) => (
                                <BookCard key={relatedBook.id} book={relatedBook} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
                            Belum ada rekomendasi lain pada kategori ini.
                        </div>
                    )}
                </section>
            </section>
        </CustomerLayout>
    );
}
