import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navigation = [
    { name: 'Dashboard', route: 'dashboard', current: 'dashboard' },
    {
        name: 'Kategori',
        route: 'admin.categories.index',
        current: 'admin.categories.*',
    },
    {
        name: 'Buku',
        route: 'admin.books.index',
        current: 'admin.books.*',
    },
    { name: 'Pesanan', badge: 'Soon' },
    { name: 'Pembayaran', badge: 'Soon' },
];

function NavigationItem({ item, active = false, onClick }) {
    const baseClassName =
        'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition';

    if (item.route) {
        return (
            <Link
                href={route(item.route)}
                onClick={onClick}
                className={`${baseClassName} ${
                    active
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-950/10'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
                <span>{item.name}</span>
            </Link>
        );
    }

    return (
        <div
            className={`${baseClassName} border border-dashed border-slate-200 text-slate-400`}
        >
            <span>{item.name}</span>
            {item.badge && (
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {item.badge}
                </span>
            )}
        </div>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingSidebar, setShowingSidebar] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            {showingSidebar && (
                <div className="fixed inset-0 z-40 bg-slate-950/50 xl:hidden">
                    <button
                        type="button"
                        className="h-full w-full"
                        onClick={() => setShowingSidebar(false)}
                    />
                </div>
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 transition-transform xl:translate-x-0 ${
                    showingSidebar ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between">
                    <Link href={route('dashboard')} className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-base font-bold text-white">
                            JM
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
                                Javamifi
                            </p>
                            <p className="text-sm text-slate-500">
                                Admin Panel
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setShowingSidebar(false)}
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 xl:hidden"
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mt-10 space-y-2">
                    {navigation.map((item) => (
                        <NavigationItem
                            key={item.name}
                            item={item}
                            active={item.current ? route().current(item.current) : false}
                            onClick={() => setShowingSidebar(false)}
                        />
                    ))}
                </div>
            </aside>

            <div className="xl:pl-72">
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
                    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowingSidebar(true)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 xl:hidden"
                            >
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 7h16M4 12h16M4 17h16"
                                    />
                                </svg>
                            </button>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
                                    Admin Overview
                                </p>
                                <h1 className="text-lg font-semibold text-slate-950">
                                    Panel Manajemen
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:block">
                                <p className="text-sm font-semibold text-slate-900">
                                    {user.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {user.email}
                                </p>
                            </div>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="inline-flex items-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    {header && <div className="mb-6">{header}</div>}
                    {children}
                </main>
            </div>
        </div>
    );
}
