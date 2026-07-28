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

export default function Index({ orders, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const applyFilters = (overrides = {}) => {
        router.get(
            route('admin.orders.index'),
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
                        Pesanan
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Pantau semua pesanan customer lengkap dengan status
                        order dan pembayaran.
                    </p>
                </div>
            }
        >
            <Head title="Pesanan" />

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
                            route('admin.orders.index'),
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
                    searchPlaceholder="Cari nomor pesanan, customer, email, atau status..."
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                <th className="pb-4 pr-4">
                                    <SortableHeader
                                        label="Order"
                                        sortKey="order_number"
                                        currentSort={filters?.sort}
                                        currentDirection={filters?.direction}
                                        onSort={handleSort}
                                    />
                                </th>
                                <th className="pb-4 pr-4">Customer</th>
                                <th className="pb-4 pr-4">Pembayaran</th>
                                <th className="pb-4 pr-4">
                                    <SortableHeader
                                        label="Total"
                                        sortKey="grand_total"
                                        currentSort={filters?.sort}
                                        currentDirection={filters?.direction}
                                        onSort={handleSort}
                                    />
                                </th>
                                <th className="pb-4 pr-4">
                                    <SortableHeader
                                        label="Status"
                                        sortKey="status"
                                        currentSort={filters?.sort}
                                        currentDirection={filters?.direction}
                                        onSort={handleSort}
                                    />
                                </th>
                                <th className="pb-4">
                                    <SortableHeader
                                        label="Dibuat"
                                        sortKey="created_at"
                                        currentSort={filters?.sort}
                                        currentDirection={filters?.direction}
                                        onSort={handleSort}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.data.length > 0 ? (
                                orders.data.map((order) => (
                                    <tr key={order.id}>
                                        <td className="py-4 pr-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {order.order_number}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {order.payment_number || '-'}
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
                                            <div>
                                                <p>{order.payment_type || '-'}</p>
                                                <p className="mt-1 text-slate-400">
                                                    {order.payment_status || '-'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4 font-medium text-slate-900">
                                            {formatCurrency(order.grand_total)}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-slate-600">
                                            {order.created_at}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-12 text-center text-sm text-slate-500"
                                    >
                                        Belum ada data pesanan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePagination paginated={orders} />
            </section>
        </AuthenticatedLayout>
    );
}
