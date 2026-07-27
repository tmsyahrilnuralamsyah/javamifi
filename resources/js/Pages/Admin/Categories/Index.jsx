import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

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

export default function Index({ categories = [] }) {
    const destroyCategory = (category) => {
        if (!window.confirm(`Hapus kategori "${category.name}"?`)) {
            return;
        }

        router.delete(route('admin.categories.destroy', category.id));
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
                            Kategori Buku
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Kelola kategori untuk pengelompokan ebook di
                            katalog.
                        </p>
                    </div>

                    <Link
                        href={route('admin.categories.create')}
                        className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Tambah Kategori
                    </Link>
                </div>
            }
        >
            <Head title="Kategori" />

            <div className="space-y-6">
                <FlashMessage />

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead>
                                <tr className="text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                    <th className="pb-4 pr-4">Nama</th>
                                    <th className="pb-4 pr-4">Slug</th>
                                    <th className="pb-4 pr-4">Deskripsi</th>
                                    <th className="pb-4 pr-4">Buku</th>
                                    <th className="pb-4 pr-4">Status</th>
                                    <th className="pb-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <tr key={category.id}>
                                            <td className="py-4 pr-4">
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {category.name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Dibuat {category.created_at}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4 text-sm text-slate-600">
                                                {category.slug}
                                            </td>
                                            <td className="py-4 pr-4 text-sm text-slate-600">
                                                {category.description || '-'}
                                            </td>
                                            <td className="py-4 pr-4 text-sm font-medium text-slate-900">
                                                {category.books_count}
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        category.is_active
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-slate-200 text-slate-700'
                                                    }`}
                                                >
                                                    {category.is_active
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            'admin.categories.edit',
                                                            category.id,
                                                        )}
                                                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            destroyCategory(
                                                                category,
                                                            )
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
                                            colSpan="6"
                                            className="py-12 text-center text-sm text-slate-500"
                                        >
                                            Belum ada kategori. Tambahkan
                                            kategori pertama untuk mulai
                                            mengelola buku.
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
