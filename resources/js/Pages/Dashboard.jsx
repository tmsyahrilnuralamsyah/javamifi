import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const RANGE_OPTIONS = [
    { value: 7, label: '7 Hari' },
    { value: 30, label: '1 Bulan' },
    { value: 90, label: '3 Bulan' },
];

const PIE_SEGMENTS = [
    { key: 'paid', label: 'Paid', color: '#10b981', light: 'bg-emerald-100 text-emerald-700' },
    { key: 'pending', label: 'Pending', color: '#f59e0b', light: 'bg-amber-100 text-amber-700' },
    { key: 'failed', label: 'Failed', color: '#f43f5e', light: 'bg-rose-100 text-rose-700' },
    { key: 'expired', label: 'Expired', color: '#94a3b8', light: 'bg-slate-200 text-slate-700' },
    { key: 'cancelled', label: 'Cancelled', color: '#64748b', light: 'bg-slate-300 text-slate-700' },
];

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(Number(value || 0));
}

function buildAreaPath(points, width, height) {
    if (points.length === 0) {
        return '';
    }

    const linePath = points
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
        .join(' ');

    return `${linePath} L ${width - 20} ${height - 20} L 20 ${height - 20} Z`;
}

function buildLinePath(points) {
    if (points.length === 0) {
        return '';
    }

    return points
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
        .join(' ');
}

function RangeSelect({ value, onChange }) {
    return (
        <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Range
            </p>
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            >
                {RANGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function LineChartCard({
    title,
    subtitle,
    series,
    range,
    formatValue,
    accentFrom = '#0f172a',
    accentVia = '#0284c7',
    accentTo = '#7dd3fc',
}) {
    const filteredSeries = useMemo(() => {
        return series.slice(Math.max(series.length - range, 0));
    }, [range, series]);

    const chartData = useMemo(() => {
        const width = 760;
        const height = 280;
        const max = Math.max(...filteredSeries.map((item) => Number(item.value || 0)), 0);
        const safeMax = max <= 0 ? 1 : max;
        const stepX =
            filteredSeries.length > 1 ? (width - 40) / (filteredSeries.length - 1) : width - 40;

        const points = filteredSeries.map((item, index) => ({
            ...item,
            x: 20 + stepX * index,
            y: height - 20 - (Number(item.value || 0) / safeMax) * (height - 70),
        }));

        return {
            width,
            height,
            safeMax,
            points,
            total: filteredSeries.reduce((sum, item) => sum + Number(item.value || 0), 0),
        };
    }, [filteredSeries]);

    const tickStep = range <= 7 ? 1 : range <= 30 ? 5 : 15;

    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-lg font-semibold text-slate-950">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
                </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                            Total {range === 30 ? '1 Bulan' : range === 90 ? '3 Bulan' : '7 Hari'}
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                            {formatValue(chartData.total)}
                        </p>
                    </div>
                    <p className="text-sm text-slate-500">
                        Data terbaru sampai hari ini
                    </p>
                </div>

                <div className="mt-6">
                    <svg
                        viewBox={`0 0 ${chartData.width} ${chartData.height}`}
                        className="h-72 w-full"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id={`${title}-area`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={accentTo} stopOpacity="0.35" />
                                <stop offset="100%" stopColor={accentTo} stopOpacity="0.02" />
                            </linearGradient>
                            <linearGradient id={`${title}-line`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={accentFrom} />
                                <stop offset="55%" stopColor={accentVia} />
                                <stop offset="100%" stopColor={accentTo} />
                            </linearGradient>
                        </defs>

                        {[0, 1, 2, 3].map((step) => {
                            const y = 20 + ((chartData.height - 40) / 3) * step;
                            return (
                                <line
                                    key={step}
                                    x1="20"
                                    x2={chartData.width - 20}
                                    y1={y}
                                    y2={y}
                                    stroke="#e2e8f0"
                                    strokeDasharray="4 6"
                                />
                            );
                        })}

                        <path
                            d={buildAreaPath(chartData.points, chartData.width, chartData.height)}
                            fill={`url(#${title}-area)`}
                        />

                        <path
                            d={buildLinePath(chartData.points)}
                            fill="none"
                            stroke={`url(#${title}-line)`}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {chartData.points.map((point, index) => (
                            <g key={point.date}>
                                {(index % tickStep === 0 || index === chartData.points.length - 1) && (
                                    <text
                                        x={point.x}
                                        y={chartData.height - 2}
                                        textAnchor="middle"
                                        className="fill-slate-400 text-[11px] font-semibold uppercase tracking-[0.18em]"
                                    >
                                        {point.label}
                                    </text>
                                )}

                                <circle cx={point.x} cy={point.y} r="5.5" fill="#ffffff" />
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="4"
                                    fill={accentVia}
                                    stroke="#ffffff"
                                    strokeWidth="1.5"
                                />
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
        </section>
    );
}

function StatusPieChart({ summary }) {
    const total = PIE_SEGMENTS.reduce((sum, item) => sum + Number(summary?.[item.key] || 0), 0);
    const safeTotal = total > 0 ? total : 1;

    const gradient = useMemo(() => {
        let start = 0;

        const segments = PIE_SEGMENTS.map((item) => {
            const value = Number(summary?.[item.key] || 0);
            const angle = (value / safeTotal) * 360;
            const end = start + angle;
            const segment = `${item.color} ${start}deg ${end}deg`;
            start = end;
            return segment;
        });

        return `conic-gradient(${segments.join(', ')})`;
    }, [safeTotal, summary]);

    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">Status Breakdown</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
                Distribusi pesanan berdasarkan status dalam bentuk pie chart.
            </p>

            <div className="mt-8 flex flex-col gap-8 xl:flex-row xl:items-center">
                <div className="mx-auto">
                    <div
                        className="relative h-64 w-64 rounded-full"
                        style={{ background: gradient }}
                    >
                        <div className="absolute inset-[22%] flex items-center justify-center rounded-full bg-white shadow-inner">
                            <div className="text-center">
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                    Total
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-slate-950">
                                    {formatNumber(total)}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">Pesanan</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    {PIE_SEGMENTS.map((item) => {
                        const value = Number(summary?.[item.key] || 0);
                        const percent = Math.round((value / safeTotal) * 100);

                        return (
                            <div
                                key={item.key}
                                className="rounded-3xl border border-slate-200 px-4 py-4"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="font-medium text-slate-900">
                                            {item.label}
                                        </span>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${item.light}`}
                                    >
                                        {percent || 0}%
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                                    <span>{formatNumber(value)} pesanan</span>
                                    <span>{item.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function TopBooks({ books }) {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">Top Buku Terlaris</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
                Berdasarkan item yang masuk pada pembayaran berstatus paid.
            </p>

            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                            <th className="pb-4 pr-4">Buku</th>
                            <th className="pb-4 pr-4">Terjual</th>
                            <th className="pb-4">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {books.length > 0 ? (
                            books.map((book) => (
                                <tr key={book.book_id}>
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-3">
                                            {book.cover_url ? (
                                                <img
                                                    src={book.cover_url}
                                                    alt={book.title}
                                                    className="h-12 w-9 rounded-xl object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-400">
                                                    N/A
                                                </div>
                                            )}
                                            <p className="font-semibold text-slate-900">
                                                {book.title}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 font-medium text-slate-900">
                                        {formatNumber(book.total_sold)}
                                    </td>
                                    <td className="py-4 font-medium text-slate-900">
                                        {formatCurrency(book.total_revenue)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="py-10 text-center text-sm text-slate-500"
                                >
                                    Belum ada data penjualan buku.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default function Dashboard({
    stats,
    revenueSeries = [],
    orderSeries = [],
    topBooks = [],
    orderStatusSummary = {},
}) {
    const [range, setRange] = useState(7);

    const cards = [
        {
            title: 'Total Buku',
            value: stats?.books ?? 0,
            description: 'Semua data buku yang tersimpan di sistem.',
        },
        {
            title: 'Buku Published',
            value: stats?.published_books ?? 0,
            description: 'Buku yang sedang ditampilkan ke katalog customer.',
        },
        {
            title: 'Total Kategori',
            value: stats?.categories ?? 0,
            description: 'Master kategori untuk pengelompokan buku.',
        },
        {
            title: 'Total Customer',
            value: stats?.customers ?? 0,
            description: 'Akun customer yang terdaftar di aplikasi.',
        },
        {
            title: 'Total Pesanan',
            value: stats?.orders ?? 0,
            description: 'Semua pesanan yang tercatat di sistem.',
        },
        {
            title: 'Buku Terbeli',
            value: stats?.user_books ?? 0,
            description: 'Total catatan buku yang sudah dimiliki customer.',
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
                            Tampilan dashboard dirapikan dengan chart yang lebih modern,
                            responsif, dan fokus pada data penjualan ebook.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                            Revenue Bulan Ini
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">
                            {formatCurrency(stats?.revenue_month ?? 0)}
                        </p>
                        <div className="mt-2 grid gap-1 text-sm text-slate-500">
                            <p>
                                Hari ini:{' '}
                                <span className="font-medium text-slate-900">
                                    {formatCurrency(stats?.revenue_today ?? 0)}
                                </span>
                            </p>
                            <p>
                                Total paid:{' '}
                                <span className="font-medium text-slate-900">
                                    {formatCurrency(stats?.revenue ?? 0)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <p className="text-sm font-medium text-slate-500">
                                {card.title}
                            </p>
                            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                                {formatNumber(card.value)}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-950">
                                Grafik Penjualan
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Pilih range untuk melihat trend revenue dan jumlah pesanan.
                            </p>
                        </div>
                        <RangeSelect value={range} onChange={setRange} />
                    </div>

                    <div className="mt-6 grid gap-6 xl:grid-cols-2">
                        <LineChartCard
                            title="Grafik Revenue"
                            subtitle="Total pemasukan berdasarkan pembayaran berstatus paid."
                            series={revenueSeries}
                            range={range}
                            formatValue={formatCurrency}
                        />
                        <LineChartCard
                            title="Grafik Jumlah Pesanan"
                            subtitle="Jumlah pesanan yang dibuat per hari."
                            series={orderSeries}
                            range={range}
                            formatValue={(value) => `${formatNumber(value)} pesanan`}
                            accentFrom="#1e293b"
                            accentVia="#2563eb"
                            accentTo="#93c5fd"
                        />
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                    <TopBooks books={topBooks} />
                    <StatusPieChart summary={orderStatusSummary} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
