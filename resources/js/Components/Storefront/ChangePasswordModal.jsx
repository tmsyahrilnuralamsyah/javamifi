import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function ChangePasswordModal({ open, onClose }) {
    const { data, setData, put, processing, errors, reset, recentlySuccessful } =
        useForm({
            current_password: '',
            password: '',
            password_confirmation: '',
        });

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const submit = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={open} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="space-y-5 p-6 sm:p-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                        Profil
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                        Ubah Password
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Masukkan password lama lalu simpan password baru untuk akun kamu.
                    </p>
                </div>

                {recentlySuccessful && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        Password berhasil diperbarui.
                    </div>
                )}

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Password Lama
                    </label>
                    <input
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Password Baru
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Konfirmasi Password Baru
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Password'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
