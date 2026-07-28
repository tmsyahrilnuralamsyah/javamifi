import SortableHeader from '@/Components/Admin/SortableHeader';
import TablePagination from '@/Components/Admin/TablePagination';
import TableToolbar from '@/Components/Admin/TableToolbar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

export default function Index({ payments, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const applyFilters = (overrides = {}) => {
        router.get(
            route('admin.payments.index'),
            {
                search,
                sort: filters?.sort ?? 'created_at',
                direction: filters?.direction ?? 'desc',
                per_page: filters?.per_page ?? 10,
                ...overrides,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSort = (sortKey) => {
        const isCurrent = filters?.sort === sortKey;

        applyFilters({
            sort: sortKey,
            direction: isCurrent && filters?.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-600">
                        Transaksi
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                        Pembayaran
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Lihat daftar pembayaran Midtrans dan status transaksi
                        yang masuk ke sistem.
                    </p>
                </div>
            }
        >
            <Head title="Pembayaran" />

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <TableToolbar
                    search={search}
                    onSearchChange={setSearch}
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilters({ page: 1 });
                    }}
                    onReset={() => {
                        setSearch('');
                        router.get(
                            route('admin.payments.index'),
                            {
                                search: '',
                                sort: 'created_at',
                                direction: 'desc',
                                per_page: 10,
                            },
                            {
                                preserveState: true,
                                preserveScroll: true,
                                replace: true,
                            },
                        );
                    }}
                    perPage={filters?.per_page ?? 10}
                    onPerPageChange={(value) =>
                        applyFilters({ per_page: value, page: 1 })
                    }
                    searchPlaceholder="Cari nomor pembayaran, order, customer, atau status..."
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                <th className="pb-4 pr-4">
                                    <SortableHeader
                                        label="Payment"
                                        sortKey="payment_number"
                                        currentSort={filters?.sort}
                                        currentDirection={filters?.direction}
                                        onSort={handleSort}
                                    />
                                </th>
                                <th className="pb-4 pr-4">Order</th>
                                <th className="pb-4 pr-4">Customer</th>
                                <th className="pb-4 pr-4">
                                    <SortableHeader
                                        label="Total"
                                        sortKey="gross_amount"
                                        currentSort={filters?.sort}
                                        currentDirection={filters?.direction}
                                        onSort={handleSort}
                                    />
                                </th>
                                <th className="pb-4 pr-4">
                                    <SortableHeader
                                        label="Status"
                                        sortKey="transaction_status"
                                        currentSort={filters?.sort}
                                        currentDirection={filters?.direction}
                                        onSort={handleSort}
                                    />
                                </th>
                                <th className="pb-4">
                                    <SortableHeader
                                        label="Paid At"
                                        sortKey="paid_at"
                                        currentSort={filters?.sort}
                                        currentDirection={filters?.direction}
                                        onSort={handleSort}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.data.length > 0 ? (
                                payments.data.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="py-4 pr-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {payment.payment_number}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {payment.payment_type || '-'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <p className="font-medium text-slate-900">
                                                {payment.order_number || '-'}
                                            </p>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {payment.customer_name}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {payment.customer_email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4 font-medium text-slate-900">
                                            {formatCurrency(payment.gross_amount)}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                                                {payment.transaction_status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-slate-600">
                                            {payment.paid_at || '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-12 text-center text-sm text-slate-500"
                                    >
                                        Belum ada data pembayaran.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination paginated={payments} />
            </section>
        </AuthenticatedLayout>
    );
}
