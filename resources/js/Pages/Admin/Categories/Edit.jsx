import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name ?? '',
        description: category.description ?? '',
        is_active: Boolean(category.is_active),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', category.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-600">
                        Master Data
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                        Edit Kategori
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Perbarui detail kategori agar katalog tetap rapi.
                    </p>
                </div>
            }
        >
            <Head title="Edit Kategori" />

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Nama Kategori
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Deskripsi
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows="5"
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>

                    <label className="flex items-center gap-3 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        Kategori aktif
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : 'Update Kategori'}
                        </button>
                        <Link
                            href={route('admin.categories.index')}
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </section>
        </AuthenticatedLayout>
    );
}
