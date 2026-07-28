import FlashMessage from '@/Components/Storefront/FlashMessage';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ books }) {
    return (
        <CustomerLayout>
            <Head title="Buku Saya" />

            <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                        Buku Saya
                    </p>
                    <h1 className="mt-2 text-4xl font-semibold text-slate-950">
                        Akses semua ebook yang sudah dibeli
                    </h1>
                    <p className="mt-3 text-base text-slate-500">
                        Setelah pembayaran selesai, link ebook langsung tersedia di sini meskipun
                        data buku aslinya sudah di-soft delete.
                    </p>
                </div>

                <FlashMessage />

                {books.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {books.map((book) => (
                            <article
                                key={book.id}
                                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                            >
                                <div className="aspect-[5/3] bg-slate-100">
                                    {book.cover_url ? (
                                        <img
                                            src={book.cover_url}
                                            alt={book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                            N/A
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 p-6">
                                    <div>
                                        <p className="text-xl font-semibold text-slate-950">
                                            {book.title}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {book.author}
                                            {book.category ? ` • ${book.category}` : ''}
                                        </p>
                                    </div>

                                    <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                                        <p>Tanggal beli: {book.purchased_at || '-'}</p>
                                        <p className="mt-1">Nomor pesanan: {book.order_number || '-'}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {book.drive_link ? (
                                            <a
                                                href={book.drive_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                            >
                                                Buka Ebook
                                            </a>
                                        ) : (
                                            <span className="inline-flex items-center rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
                                                Link ebook belum tersedia
                                            </span>
                                        )}

                                        {book.order_url && (
                                            <Link
                                                href={book.order_url}
                                                className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Detail Pesanan
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <p className="text-lg font-semibold text-slate-900">
                            Kamu belum punya ebook.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Beli buku dari katalog lalu ebook akan otomatis muncul di sini setelah
                            pembayaran berhasil.
                        </p>
                        <Link
                            href={route('storefront.index')}
                            className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Jelajahi Katalog
                        </Link>
                    </div>
                )}
            </section>
        </CustomerLayout>
    );
}
