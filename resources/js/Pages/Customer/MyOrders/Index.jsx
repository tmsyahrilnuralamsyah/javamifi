import FlashMessage from '@/Components/Storefront/FlashMessage';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency } from '@/utils/format';

const statusStyles = {
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-rose-100 text-rose-700',
    expired: 'bg-slate-200 text-slate-700',
    cancelled: 'bg-slate-300 text-slate-700',
};

export default function Index({ orders }) {
    return (
        <CustomerLayout>
            <Head title="Pesanan Saya" />

            <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                        Pesanan Saya
                    </p>
                    <h1 className="mt-2 text-4xl font-semibold text-slate-950">
                        Riwayat checkout dan pembayaran
                    </h1>
                    <p className="mt-3 text-base text-slate-500">
                        Lihat status transaksi, nomor pembayaran Midtrans, dan buka detail pesanan
                        kapan saja.
                    </p>
                </div>

                <FlashMessage />

                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <article
                                key={order.id}
                                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p className="text-xl font-semibold text-slate-950">
                                                {order.order_number}
                                            </p>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    statusStyles[order.status] ||
                                                    'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Dibuat {order.created_at || '-'}
                                            {order.paid_at ? ` • Dibayar ${order.paid_at}` : ''}
                                        </p>
                                    </div>

                                    <div className="text-left lg:text-right">
                                        <p className="text-sm text-slate-500">Total</p>
                                        <p className="mt-1 text-2xl font-semibold text-slate-950">
                                            {formatCurrency(order.grand_total)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-4 rounded-[1.5rem] bg-slate-50 p-5 sm:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-slate-500">Jumlah Buku</p>
                                        <p className="mt-1 font-semibold text-slate-950">
                                            {order.total_items}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Nomor Pembayaran</p>
                                        <p className="mt-1 font-semibold text-slate-950">
                                            {order.payment_number || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Status Midtrans</p>
                                        <p className="mt-1 font-semibold text-slate-950">
                                            {order.payment_status || '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link
                                        href={order.detail_url}
                                        className="inline-flex items-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        Lihat Detail Pesanan
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <p className="text-lg font-semibold text-slate-900">
                            Belum ada pesanan.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Saat kamu checkout, riwayat pesanan akan muncul di halaman ini.
                        </p>
                        <Link
                            href={route('storefront.index')}
                            className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                )}
            </section>
        </CustomerLayout>
    );
}
