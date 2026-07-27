import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { BookForm } from './Create';

export default function Edit({ book, categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: book.category_id?.toString() ?? '',
        title: book.title ?? '',
        author: book.author ?? '',
        publisher: book.publisher ?? '',
        isbn: book.isbn ?? '',
        price_normal: book.price_normal ?? '',
        price_discount: book.price_discount ?? '',
        cover: null,
        drive_link: book.drive_link ?? '',
        description: book.description ?? '',
        is_published: Boolean(book.is_published),
        _method: 'put',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.books.update', book.id), {
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
                        Edit Buku
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Perbarui informasi buku agar katalog selalu akurat.
                    </p>
                </div>
            }
        >
            <Head title="Edit Buku" />

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <BookForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel="Update Buku"
                    categories={categories}
                    coverPreviewUrl={book.cover_url}
                />
            </section>
        </AuthenticatedLayout>
    );
}
