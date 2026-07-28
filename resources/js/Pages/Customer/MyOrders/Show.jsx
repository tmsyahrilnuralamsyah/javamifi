import FlashMessage from '@/Components/Storefront/FlashMessage';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { formatCurrency } from '@/utils/format';

const statusStyles = {
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-rose-100 text-rose-700',
    expired: 'bg-slate-200 text-slate-700',
    cancelled: 'bg-slate-300 text-slate-700',
};

export default function Show({ order }) {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const payOrder = async () => {
        try {
            setProcessing(true);
            setError('');

            const response = await axios.post(route('customer.my-orders.pay', order.id));
            const payload = response.data?.data;

            if (payload?.snap_redirect_url) {
                window.location.href = payload.snap_redirect_url;
                return;
            }

            throw new Error('URL pembayaran Midtrans tidak tersedia.');
        } catch (requestError) {
            setError(
                requestError?.response?.data?.message ||
                    'Pembayaran belum bisa diproses. Silakan coba lagi.',
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <CustomerLayout>
            <Head title={order.order_number} />

            <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                            Detail Pesanan
                        </p>
                        <h1 className="mt-2 text-4xl font-semibold text-slate-950">
                            {order.order_number}
                        </h1>
                        <p className="mt-3 text-base text-slate-500">
                            Dibuat {order.created_at || '-'}
                            {order.paid_at ? ` • Dibayar ${order.paid_at}` : ''}
                        </p>
                    </div>

                    <span
                        className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                            statusStyles[order.status] || 'bg-slate-100 text-slate-700'
                        }`}
                    >
                        {order.status}
                    </span>
                </div>

                <FlashMessage />

                {error && (
                    <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <article
                                key={item.id}
                                className="flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
                            >
                                <div className="h-32 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                                    {item.cover_url ? (
                                        <img
                                            src={item.cover_url}
                                            alt={item.book_title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                            N/A
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className="text-xl font-semibold text-slate-950">
                                        {item.book_title}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {item.author || '-'}
                                    </p>
                                    <p className="mt-4 text-base font-semibold text-slate-950">
                                        {formatCurrency(item.final_price)}
                                    </p>

                                    {item.detail_url && (
                                        <Link
                                            href={item.detail_url}
                                            className="mt-4 inline-flex rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Lihat Detail Buku
                                        </Link>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>

                    <aside className="h-fit space-y-4">
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-lg font-semibold text-slate-950">Informasi Pembayaran</p>
                            <div className="mt-6 space-y-4 text-sm text-slate-600">
                                <div className="flex items-start justify-between gap-4">
                                    <span>Nomor Pembayaran</span>
                                    <span className="text-right font-semibold text-slate-950">
                                        {order.payment?.payment_number || '-'}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <span>Status Midtrans</span>
                                    <span className="text-right font-semibold text-slate-950">
                                        {order.payment?.transaction_status || '-'}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <span>Metode</span>
                                    <span className="text-right font-semibold text-slate-950">
                                        {order.payment?.payment_type || '-'}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <span>Total</span>
                                    <span className="text-right font-semibold text-slate-950">
                                        {formatCurrency(order.grand_total)}
                                    </span>
                                </div>
                            </div>

                            {order.can_pay && (
                                <button
                                    type="button"
                                    onClick={payOrder}
                                    disabled={processing}
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Menyiapkan pembayaran...' : 'Bayar Pesanan Ini'}
                                </button>
                            )}
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-lg font-semibold text-slate-950">Ringkasan</p>
                            <div className="mt-6 space-y-4 text-sm text-slate-600">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-slate-950">
                                        {formatCurrency(order.subtotal)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Diskon</span>
                                    <span className="font-semibold text-slate-950">
                                        {formatCurrency(order.discount_total)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base">
                                    <span className="font-semibold text-slate-950">Grand Total</span>
                                    <span className="font-semibold text-slate-950">
                                        {formatCurrency(order.grand_total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </CustomerLayout>
    );
}
