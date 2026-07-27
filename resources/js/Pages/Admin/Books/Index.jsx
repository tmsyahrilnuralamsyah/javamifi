import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

function FlashMessage() {
    const { flash } = usePage().props;

    if (flash?.success) {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {flash.success}
            </div>
        );
    }

    if (flash?.error) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {flash.error}
            </div>
        );
    }

    return null;
}

export default function Index({ books = [] }) {
    const destroyBook = (book) => {
        if (!window.confirm(`Hapus buku "${book.title}"?`)) {
            return;
        }

        router.delete(route('admin.books.destroy', book.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-600">
                            Master Data
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                            Buku
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Kelola katalog ebook, harga, cover, dan link Google
                            Drive.
                        </p>
                    </div>

                    <Link
                        href={route('admin.books.create')}
                        className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Tambah Buku
                    </Link>
                </div>
            }
        >
            <Head title="Buku" />

            <div className="space-y-6">
                <FlashMessage />

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead>
                                <tr className="text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                    <th className="pb-4 pr-4">Cover</th>
                                    <th className="pb-4 pr-4">Judul</th>
                                    <th className="pb-4 pr-4">Kategori</th>
                                    <th className="pb-4 pr-4">Penulis</th>
                                    <th className="pb-4 pr-4">Harga</th>
                                    <th className="pb-4 pr-4">Status</th>
                                    <th className="pb-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {books.length > 0 ? (
                                    books.map((book) => (
                                        <tr key={book.id}>
                                            <td className="py-4 pr-4">
                                                {book.cover_url ? (
                                                    <img
                                                        src={book.cover_url}
                                                        alt={book.title}
                                                        className="h-16 w-12 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-16 w-12 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-400">
                                                        N/A
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {book.title}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {book.slug}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4 text-sm text-slate-600">
                                                {book.category || '-'}
                                            </td>
                                            <td className="py-4 pr-4 text-sm text-slate-600">
                                                <div>
                                                    <p>{book.author}</p>
                                                    <p className="mt-1 text-slate-400">
                                                        {book.publisher || '-'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div>
                                                    <p className="font-medium text-slate-900">
                                                        {formatCurrency(
                                                            book.price_discount ??
                                                                book.price_normal,
                                                        )}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Normal{' '}
                                                        {formatCurrency(
                                                            book.price_normal,
                                                        )}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        book.is_published
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-slate-200 text-slate-700'
                                                    }`}
                                                >
                                                    {book.is_published
                                                        ? 'Published'
                                                        : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            'admin.books.edit',
                                                            book.id,
                                                        )}
                                                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            destroyBook(book)
                                                        }
                                                        className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="py-12 text-center text-sm text-slate-500"
                                        >
                                            Belum ada buku. Tambahkan buku
                                            pertama untuk mengisi katalog admin.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
