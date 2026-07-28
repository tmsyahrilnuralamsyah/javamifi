import ChangePasswordModal from '@/Components/Storefront/ChangePasswordModal';
import WhatsAppButton from '@/Components/Storefront/WhatsAppButton';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CustomerLayout({ children }) {
    const { auth, cart, app } = usePage().props;
    const user = auth?.user;
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    useEffect(() => {
        if (search.trim().length < 2) {
            setResults([]);
            setIsSearching(false);
            return undefined;
        }

        const timeoutId = window.setTimeout(async () => {
            try {
                setIsSearching(true);

                const response = await fetch(
                    `${route('storefront.search')}?q=${encodeURIComponent(search)}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    },
                );

                const payload = await response.json();
                setResults(payload.data ?? []);
                setShowResults(true);
            } catch {
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => window.clearTimeout(timeoutId);
    }, [search]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-center justify-between gap-4">
                            <Link href={route('storefront.index')} className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-base font-bold text-white">
                                    JM
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
                                        Javamifi
                                    </p>
                                    <p className="text-sm text-slate-500">Toko Ebook</p>
                                </div>
                            </Link>
                        </div>

                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="flex w-full items-center gap-3 lg:w-auto">
                                <div className="relative flex-1 lg:w-[26rem]">
                                    <input
                                        type="text"
                                        value={search}
                                        onFocus={() => setShowResults(true)}
                                        onBlur={() => window.setTimeout(() => setShowResults(false), 150)}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari judul, penulis, atau kategori..."
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                    />

                                    {showResults && (search.trim().length >= 2 || isSearching) && (
                                        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
                                            {isSearching ? (
                                                <div className="px-4 py-4 text-sm text-slate-500">
                                                    Mencari buku...
                                                </div>
                                            ) : results.length > 0 ? (
                                                <div className="max-h-96 overflow-y-auto py-2">
                                                    {results.map((item) => (
                                                        <Link
                                                            key={item.id}
                                                            href={item.url}
                                                            className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50"
                                                        >
                                                            {item.cover_url ? (
                                                                <img
                                                                    src={item.cover_url}
                                                                    alt={item.title}
                                                                    className="h-14 w-11 rounded-xl object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-14 w-11 items-center justify-center rounded-xl bg-slate-100 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                                                                    N/A
                                                                </div>
                                                            )}
                                                            <div className="min-w-0">
                                                                <p className="truncate font-semibold text-slate-900">
                                                                    {item.title}
                                                                </p>
                                                                <p className="mt-1 truncate text-sm text-slate-500">
                                                                    {item.author}
                                                                    {item.category
                                                                        ? ` • ${item.category}`
                                                                        : ''}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="px-4 py-4 text-sm text-slate-500">
                                                    Buku yang kamu cari belum ditemukan.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={route('cart.index')}
                                    className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                                    aria-label="Buka keranjang"
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
                                            d="M3 4h2l.4 2m0 0L7 14h10l2-8H5.4ZM7 14l-1 3h12M9 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                                        />
                                    </svg>
                                    {(cart?.count || 0) > 0 && (
                                        <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                                            {cart.count}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {user ? (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowAccountMenu((value) => !value)}
                                        className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 lg:w-auto"
                                    >
                                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                        <span className="text-left">
                                            <span className="block text-sm text-slate-900">
                                                {user.name}
                                            </span>
                                            <span className="block text-xs text-slate-500">
                                                {user.email}
                                            </span>
                                        </span>
                                    </button>

                                    {showAccountMenu && (
                                        <div className="absolute right-0 z-30 mt-3 w-64 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/80">
                                            {user.role === 'admin' && (
                                                <Link
                                                    href={route('dashboard')}
                                                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    Buka Dashboard Admin
                                                </Link>
                                            )}
                                            <Link
                                                href={route('customer.my-books.index')}
                                                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Buku Saya
                                            </Link>
                                            <Link
                                                href={route('customer.my-orders.index')}
                                                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Pesanan Saya
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowAccountMenu(false);
                                                    setShowPasswordModal(true);
                                                }}
                                                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Ubah Password
                                            </button>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>

                        <nav className="flex items-center gap-2 overflow-x-auto pb-1 lg:hidden">
                            {user ? (
                                <>
                                    <Link
                                        href={route('customer.my-books.index')}
                                        className={`inline-flex shrink-0 items-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                            route().current('customer.my-books.index')
                                                ? 'bg-slate-950 text-white'
                                                : 'bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        Buku Saya
                                    </Link>
                                    <Link
                                        href={route('customer.my-orders.index')}
                                        className={`inline-flex shrink-0 items-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                            route().current('customer.my-orders.*')
                                                ? 'bg-slate-950 text-white'
                                                : 'bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        Pesanan Saya
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href={route('cart.index')}
                                    className={`inline-flex shrink-0 items-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                        route().current('cart.index')
                                            ? 'bg-slate-950 text-white'
                                            : 'bg-slate-100 text-slate-700'
                                    }`}
                                >
                                    Keranjang
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <main>{children}</main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <p>Javamifi dibuat untuk penjualan ebook dengan alur belanja yang sederhana dan cepat.</p>
                    <a
                        href={`https://wa.me/${app?.whatsapp_admin_number}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-emerald-600"
                    >
                        Hubungi Admin via WhatsApp
                    </a>
                </div>
            </footer>

            <ChangePasswordModal
                open={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />

            <WhatsAppButton number={app?.whatsapp_admin_number} />
        </div>
    );
}
