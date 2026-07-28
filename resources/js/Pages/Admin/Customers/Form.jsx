import InputError from '@/Components/InputError';
import { Link } from '@inertiajs/react';

export default function CustomerForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    isEdit = false,
    googleId = null,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Nama Customer
                </label>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    placeholder="Contoh: Budi Santoso"
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    placeholder="customer@email.com"
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            {googleId && (
                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                    Customer ini sudah terhubung dengan login Google.
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        placeholder={
                            isEdit
                                ? 'Kosongkan jika tidak diubah'
                                : 'Masukkan password'
                        }
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Konfirmasi Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        placeholder={
                            isEdit
                                ? 'Isi jika mengubah password'
                                : 'Ulangi password'
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                    {processing ? 'Menyimpan...' : submitLabel}
                </button>
                <Link
                    href={route('admin.customers.index')}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    Kembali
                </Link>
            </div>
        </form>
    );
}
