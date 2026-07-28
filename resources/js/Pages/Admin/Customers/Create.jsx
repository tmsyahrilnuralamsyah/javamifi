import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import CustomerForm from './Form';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.customers.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-600">
                        Pengguna
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                        Tambah Customer
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Buat akun customer baru yang bisa dipakai untuk login
                        ke aplikasi.
                    </p>
                </div>
            }
        >
            <Head title="Tambah Customer" />

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <CustomerForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel="Simpan Customer"
                />
            </section>
        </AuthenticatedLayout>
    );
}
