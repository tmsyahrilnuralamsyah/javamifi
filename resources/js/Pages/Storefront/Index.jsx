import BookCard from '@/Components/Storefront/BookCard';
import FlashMessage from '@/Components/Storefront/FlashMessage';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ books, categories, filters }) {
    const changeCategory = (category = '') => {
        router.get(
            route('storefront.index'),
            {
                category,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <CustomerLayout>
            <Head title="Katalog Ebook" />

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="max-w-4xl">
                        <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-sm font-semibold text-sky-700">
                            Toko ebook untuk belajar lebih cepat
                        </span>
                        <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                            Beli ebook yang kamu butuhkan, lalu akses kapan saja dari satu tempat.
                        </h1>
                        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500">
                            Temukan koleksi ebook pilihan untuk coding, bisnis, dan pengembangan
                            diri. Proses checkout dibuat sederhana, pembayaran pakai Midtrans, dan
                            buku yang sudah dibeli langsung masuk ke halaman Buku Saya.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href={route('cart.index')}
                                className="inline-flex items-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Mulai Belanja
                            </Link>
                            <Link
                                href={route('customer.my-books.index')}
                                className="inline-flex items-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Buku Saya
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                <FlashMessage />

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                                Katalog
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                                Pilih ebook berdasarkan kategori
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3 overflow-x-auto">
                            <button
                                type="button"
                                onClick={() => changeCategory('')}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    !filters?.category
                                        ? 'bg-slate-950 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => changeCategory(category.slug)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        filters?.category === category.slug
                                            ? 'bg-slate-950 text-white'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {category.name} ({category.books_count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {books.data.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                            {books.data.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Menampilkan halaman {books.current_page} dari {books.last_page}.
                            </p>
                            <div className="flex gap-3">
                                <Link
                                    href={books.prev_page_url || '#'}
                                    preserveScroll
                                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                        books.prev_page_url
                                            ? 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                                            : 'cursor-not-allowed border border-slate-100 text-slate-300'
                                    }`}
                                >
                                    Sebelumnya
                                </Link>
                                <Link
                                    href={books.next_page_url || '#'}
                                    preserveScroll
                                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                        books.next_page_url
                                            ? 'bg-slate-950 text-white hover:bg-slate-800'
                                            : 'cursor-not-allowed bg-slate-200 text-slate-400'
                                    }`}
                                >
                                    Berikutnya
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <p className="text-lg font-semibold text-slate-900">
                            Buku pada kategori ini belum tersedia.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Coba pilih kategori lain atau cari lewat kolom pencarian di navbar.
                        </p>
                    </div>
                )}
            </section>
        </CustomerLayout>
    );
}
