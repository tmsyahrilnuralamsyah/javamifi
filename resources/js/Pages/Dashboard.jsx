import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-rose-100 text-rose-700',
    expired: 'bg-slate-200 text-slate-700',
    cancelled: 'bg-slate-200 text-slate-700',
};

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

export default function Dashboard({ stats, recentOrders = [] }) {
    const cards = [
        {
            title: 'Total Buku',
            value: stats?.books ?? 0,
            description: 'Koleksi ebook aktif di katalog admin.',
        },
        {
            title: 'Total Kategori',
            value: stats?.categories ?? 0,
            description: 'Kategori yang dipakai untuk pengelompokan buku.',
        },
        {
            title: 'Total Pesanan',
            value: stats?.orders ?? 0,
            description: 'Semua order yang sudah tercatat di sistem.',
        },
        {
            title: 'Total Admin',
            value: stats?.admins ?? 0,
            description: 'Akun admin yang memiliki akses ke panel ini.',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-600">
                            Dashboard
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                            Ringkasan admin panel
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Tampilan ini mengikuti nuansa dashboard modern
                            seperti referensi TailAdmin, lalu disesuaikan untuk
                            aplikasi penjualan ebook.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                            Revenue
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">
                            {formatCurrency(stats?.revenue ?? 0)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Akumulasi pembayaran berstatus `paid`.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="grid gap-4 xl:grid-cols-4">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <p className="text-sm font-medium text-slate-500">
                                {card.title}
                            </p>
                            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                                {card.value}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-950">
                                    Target Bulanan
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Komponen ini meniru pola kartu insight pada
                                    dashboard referensi.
                                </p>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                +10%
                            </span>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <div className="rounded-3xl bg-slate-950 p-5 text-white">
                                <p className="text-sm text-slate-300">
                                    Target
                                </p>
                                <p className="mt-3 text-2xl font-semibold">
                                    {formatCurrency(20000000)}
                                </p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Revenue
                                </p>
                                <p className="mt-3 text-2xl font-semibold text-slate-950">
                                    {formatCurrency(stats?.revenue ?? 0)}
                                </p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Today
                                </p>
                                <p className="mt-3 text-2xl font-semibold text-slate-950">
                                    {formatCurrency(0)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-end gap-3">
                                {[42, 55, 38, 68, 57, 73, 62, 79, 58, 69, 84, 76].map(
                                    (height, index) => (
                                        <div
                                            key={index}
                                            className="flex-1 rounded-t-2xl bg-gradient-to-t from-slate-950 via-sky-600 to-sky-300"
                                            style={{ height: `${height * 2}px` }}
                                        />
                                    ),
                                )}
                            </div>
                            <div className="mt-4 flex justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                                <span>Jan</span>
                                <span>Mar</span>
                                <span>May</span>
                                <span>Jul</span>
                                <span>Sep</span>
                                <span>Nov</span>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold text-slate-950">
                            Ringkasan Sistem
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Snapshot cepat untuk area admin yang sedang
                            dibangun.
                        </p>

                        <div className="mt-6 space-y-4">
                            {[
                                {
                                    label: 'Autentikasi Admin',
                                    value: 'Aktif',
                                    tone: 'bg-emerald-100 text-emerald-700',
                                },
                                {
                                    label: 'Master Data',
                                    value: 'Segera',
                                    tone: 'bg-amber-100 text-amber-700',
                                },
                                {
                                    label: 'Transaksi',
                                    value: 'Segera',
                                    tone: 'bg-sky-100 text-sky-700',
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between rounded-3xl border border-slate-200 px-4 py-4"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {item.label}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Struktur siap untuk modul berikutnya.
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}
                                    >
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-950">
                                Pesanan Terbaru
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Data ini sudah diambil dari backend Laravel.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead>
                                <tr className="text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                    <th className="pb-4 pr-4">Order</th>
                                    <th className="pb-4 pr-4">Customer</th>
                                    <th className="pb-4 pr-4">Tanggal</th>
                                    <th className="pb-4 pr-4">Total</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="py-4 pr-4">
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {order.order_number}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        ID #{order.id}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div>
                                                    <p className="font-medium text-slate-900">
                                                        {order.customer_name}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {order.customer_email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4 text-sm text-slate-600">
                                                {order.created_at}
                                            </td>
                                            <td className="py-4 pr-4 font-medium text-slate-900">
                                                {formatCurrency(
                                                    order.grand_total,
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                        statusColors[
                                                            order.status
                                                        ] ??
                                                        'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-10 text-center text-sm text-slate-500"
                                        >
                                            Belum ada pesanan. Setelah modul
                                            transaksi dibuat, data terbaru akan
                                            muncul di sini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
