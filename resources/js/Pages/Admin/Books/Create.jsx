import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export function BookForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    categories,
    coverPreviewUrl = null,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <label
                        htmlFor="category_id"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Kategori
                    </label>
                    <select
                        id="category_id"
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    >
                        <option value="">Pilih kategori</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <InputError
                        message={errors.category_id}
                        className="mt-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Judul Buku
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                    <label
                        htmlFor="author"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Penulis
                    </label>
                    <input
                        id="author"
                        type="text"
                        value={data.author}
                        onChange={(e) => setData('author', e.target.value)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                    <InputError message={errors.author} className="mt-2" />
                </div>

                <div>
                    <label
                        htmlFor="publisher"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Penerbit
                    </label>
                    <input
                        id="publisher"
                        type="text"
                        value={data.publisher}
                        onChange={(e) => setData('publisher', e.target.value)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                    <InputError message={errors.publisher} className="mt-2" />
                </div>

                <div>
                    <label
                        htmlFor="isbn"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        ISBN
                    </label>
                    <input
                        id="isbn"
                        type="text"
                        value={data.isbn}
                        onChange={(e) => setData('isbn', e.target.value)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                    <InputError message={errors.isbn} className="mt-2" />
                </div>

                <div>
                    <label
                        htmlFor="cover"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Cover Buku
                    </label>
                    <input
                        id="cover"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setData('cover', e.target.files?.[0] ?? null)
                        }
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                    />
                    {coverPreviewUrl && !data.cover && (
                        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <img
                                src={coverPreviewUrl}
                                alt="Cover buku"
                                className="h-16 w-12 rounded-lg object-cover"
                            />
                            <p className="text-sm text-slate-600">
                                Cover saat ini sudah tersimpan. Pilih file baru
                                jika ingin menggantinya.
                            </p>
                        </div>
                    )}
                    {data.cover && (
                        <p className="mt-3 text-sm text-slate-500">
                            File dipilih: {data.cover.name}
                        </p>
                    )}
                    <InputError message={errors.cover} className="mt-2" />
                </div>

                <div>
                    <label
                        htmlFor="price_normal"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Harga Normal
                    </label>
                    <input
                        id="price_normal"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price_normal}
                        onChange={(e) =>
                            setData('price_normal', e.target.value)
                        }
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                    <InputError
                        message={errors.price_normal}
                        className="mt-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="price_discount"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Harga Diskon
                    </label>
                    <input
                        id="price_discount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price_discount}
                        onChange={(e) =>
                            setData('price_discount', e.target.value)
                        }
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                    <InputError
                        message={errors.price_discount}
                        className="mt-2"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="drive_link"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Drive Link
                </label>
                <input
                    id="drive_link"
                    type="url"
                    value={data.drive_link}
                    onChange={(e) => setData('drive_link', e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    placeholder="https://drive.google.com/..."
                />
                <InputError message={errors.drive_link} className="mt-2" />
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
                    onChange={(e) => setData('description', e.target.value)}
                    rows="6"
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                    type="checkbox"
                    checked={data.is_published}
                    onChange={(e) => setData('is_published', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Buku published
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                    {processing ? 'Menyimpan...' : submitLabel}
                </button>
                <Link
                    href={route('admin.books.index')}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    Kembali
                </Link>
            </div>
        </form>
    );
}

export default function Create({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        price_normal: '',
        price_discount: '',
        cover: null,
        drive_link: '',
        description: '',
        is_published: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.books.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-600">
                        Master Data
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                        Tambah Buku
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Tambahkan ebook baru ke katalog lengkap dengan harga dan
                        link Drive.
                    </p>
                </div>
            }
        >
            <Head title="Tambah Buku" />

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <BookForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel="Simpan Buku"
                    categories={categories}
                    coverPreviewUrl={null}
                />
            </section>
        </AuthenticatedLayout>
    );
}
