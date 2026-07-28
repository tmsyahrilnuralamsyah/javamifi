import SortableHeader from '@/Components/Admin/SortableHeader';
import TablePagination from '@/Components/Admin/TablePagination';
import TableToolbar from '@/Components/Admin/TableToolbar';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

function FlashMessage() {
    const { flash } = usePage().props;

    if (flash?.success) {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {flash.success}
            </div>
        );
    }

    if (flash?.error) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {flash.error}
            </div>
        );
    }

    return null;
}

export default function Index({ customers, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const applyFilters = (overrides = {}) => {
        router.get(
            route('admin.customers.index'),
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

    const destroyCustomer = (customer) => {
        if (!window.confirm(`Hapus customer "${customer.name}"?`)) {
            return;
        }

        router.delete(route('admin.customers.destroy', customer.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-600">
                            Pengguna
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                            Customer
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Kelola akun customer yang terdaftar dan pantau
                            aktivitas pembeliannya.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Customer" />

            <div className="space-y-6">
                <FlashMessage />

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
                                route('admin.customers.index'),
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
                        createHref={route('admin.customers.create')}
                        createLabel="Tambah Customer"
                        searchPlaceholder="Cari nama atau email customer..."
                    />

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead>
                                <tr className="text-left text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                    <th className="pb-4 pr-4">
                                        <SortableHeader
                                            label="Nama"
                                            sortKey="name"
                                            currentSort={filters?.sort}
                                            currentDirection={filters?.direction}
                                            onSort={handleSort}
                                        />
                                    </th>
                                    <th className="pb-4 pr-4">
                                        <SortableHeader
                                            label="Email"
                                            sortKey="email"
                                            currentSort={filters?.sort}
                                            currentDirection={filters?.direction}
                                            onSort={handleSort}
                                        />
                                    </th>
                                    <th className="pb-4 pr-4">Login</th>
                                    <th className="pb-4 pr-4">
                                        <SortableHeader
                                            label="Pesanan"
                                            sortKey="orders_count"
                                            currentSort={filters?.sort}
                                            currentDirection={filters?.direction}
                                            onSort={handleSort}
                                        />
                                    </th>
                                    <th className="pb-4 pr-4">
                                        <SortableHeader
                                            label="Buku"
                                            sortKey="user_books_count"
                                            currentSort={filters?.sort}
                                            currentDirection={filters?.direction}
                                            onSort={handleSort}
                                        />
                                    </th>
                                    <th className="pb-4 pr-4">
                                        <SortableHeader
                                            label="Daftar"
                                            sortKey="created_at"
                                            currentSort={filters?.sort}
                                            currentDirection={filters?.direction}
                                            onSort={handleSort}
                                        />
                                    </th>
                                    <th className="pb-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {customers.data.length > 0 ? (
                                    customers.data.map((customer) => (
                                        <tr key={customer.id}>
                                            <td className="py-4 pr-4">
                                                <p className="font-semibold text-slate-900">
                                                    {customer.name}
                                                </p>
                                            </td>
                                            <td className="py-4 pr-4 text-sm text-slate-600">
                                                {customer.email}
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        customer.google_id
                                                            ? 'bg-sky-100 text-sky-700'
                                                            : 'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {customer.google_id
                                                        ? 'Google'
                                                        : 'Email'}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-4 text-sm font-medium text-slate-900">
                                                {customer.orders_count}
                                            </td>
                                            <td className="py-4 pr-4 text-sm font-medium text-slate-900">
                                                {customer.user_books_count}
                                            </td>
                                            <td className="py-4 pr-4 text-sm text-slate-600">
                                                {customer.created_at}
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            'admin.customers.edit',
                                                            customer.id,
                                                        )}
                                                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            destroyCustomer(
                                                                customer,
                                                            )
                                                        }
                                                        className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="py-12 text-center text-sm text-slate-500"
                                        >
                                            Belum ada customer. Tambahkan data
                                            customer pertama untuk mulai
                                            mengelola pengguna.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <TablePagination paginated={customers} />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
