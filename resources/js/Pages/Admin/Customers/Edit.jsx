import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import CustomerForm from './Form';

export default function Edit({ customer }) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name ?? '',
        email: customer.email ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.customers.update', customer.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-600">
                        Pengguna
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                        Edit Customer
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Perbarui data customer dan reset password bila
                        diperlukan.
                    </p>
                </div>
            }
        >
            <Head title="Edit Customer" />

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <CustomerForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel="Update Customer"
                    isEdit
                    googleId={customer.google_id}
                />
            </section>
        </AuthenticatedLayout>
    );
}
