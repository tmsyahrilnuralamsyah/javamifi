import FlashMessage from '@/Components/Storefront/FlashMessage';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { formatCurrency } from '@/utils/format';

export default function Index({ items, removedOwnedItems, summary }) {
    const { auth } = usePage().props;
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const startPayment = async () => {
        try {
            setProcessing(true);
            setError('');

            const response = await axios.post(route('checkout.store'));
            const payload = response.data?.data;

            if (payload?.snap_redirect_url) {
                window.location.href = payload.snap_redirect_url;
                return;
            }

            throw new Error('URL pembayaran Midtrans tidak tersedia.');
        } catch (requestError) {
            setError(
                requestError?.response?.data?.message ||
                    'Checkout belum bisa diproses. Silakan coba lagi.',
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <CustomerLayout>
            <Head title="Checkout" />

            <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                        Checkout
                    </p>
                    <h1 className="mt-2 text-4xl font-semibold text-slate-950">
                        Konfirmasi pembelian ebook
                    </h1>
                    <p className="mt-3 text-base text-slate-500">
                        Login sebagai <span className="font-semibold text-slate-900">{auth.user.name}</span> lalu
                        lanjutkan pembayaran Midtrans dari halaman ini.
                    </p>
                </div>

                <FlashMessage />

                {removedOwnedItems.length > 0 && (
                    <div className="rounded-[2rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
                        Buku yang sudah pernah kamu beli otomatis dikeluarkan dari checkout:
                        {' '}
                        {removedOwnedItems.map((item) => item.title).join(', ')}.
                    </div>
                )}

                {error && (
                    <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
                        {error}
                    </div>
                )}

                {items.length > 0 ? (
                    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <article
                                    key={item.id}
                                    className="flex items-center gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                                        {item.cover_url ? (
                                            <img
                                                src={item.cover_url}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                                N/A
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-lg font-semibold text-slate-950">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {item.author}
                                        </p>
                                        <p className="mt-3 text-base font-semibold text-slate-950">
                                            {formatCurrency(item.final_price)}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-lg font-semibold text-slate-950">Ringkasan Pembayaran</p>
                            <div className="mt-6 space-y-4 text-sm text-slate-600">
                                <div className="flex items-center justify-between">
                                    <span>Total Buku</span>
                                    <span className="font-semibold text-slate-950">
                                        {summary.total_items}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base">
                                    <span className="font-semibold text-slate-950">Total Bayar</span>
                                    <span className="font-semibold text-slate-950">
                                        {formatCurrency(summary.total_amount)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <button
                                    type="button"
                                    onClick={startPayment}
                                    disabled={processing}
                                    className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Menyiapkan pembayaran...' : 'Bayar Sekarang'}
                                </button>
                                <Link
                                    href={route('cart.index')}
                                    className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Kembali ke Keranjang
                                </Link>
                            </div>

                            <p className="mt-4 text-xs leading-6 text-slate-500">
                                Kamu akan diarahkan ke halaman pembayaran Midtrans, lalu kembali
                                otomatis ke aplikasi setelah proses selesai.
                            </p>
                        </aside>
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <p className="text-lg font-semibold text-slate-900">
                            Tidak ada buku yang bisa dibayar saat ini.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Semua item mungkin sudah pernah dibeli atau keranjang sudah kosong.
                        </p>
                        <Link
                            href={route('storefront.index')}
                            className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Kembali ke Katalog
                        </Link>
                    </div>
                )}
            </section>
        </CustomerLayout>
    );
}
