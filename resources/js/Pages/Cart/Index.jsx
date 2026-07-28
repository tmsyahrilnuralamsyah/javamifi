import FlashMessage from '@/Components/Storefront/FlashMessage';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { formatCurrency } from '@/utils/format';

export default function Index({ items, summary }) {
    const removeItem = (item) => {
        router.delete(route('cart.destroy', item.id), {
            preserveScroll: true,
        });
    };

    return (
        <CustomerLayout>
            <Head title="Keranjang" />

            <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">
                        Keranjang
                    </p>
                    <h1 className="mt-2 text-4xl font-semibold text-slate-950">
                        Siap lanjut checkout
                    </h1>
                    <p className="mt-3 text-base text-slate-500">
                        Keranjang memakai session, jadi buku yang kamu pilih tetap ringan dan
                        tidak langsung disimpan ke database.
                    </p>
                </div>

                <FlashMessage />

                {items.length > 0 ? (
                    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <article
                                    key={item.id}
                                    className="flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
                                >
                                    <Link
                                        href={item.detail_url}
                                        className="h-36 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100"
                                    >
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
                                    </Link>

                                    <div className="flex flex-1 flex-col justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <Link
                                                        href={item.detail_url}
                                                        className="text-xl font-semibold text-slate-950 transition hover:text-sky-700"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {item.author}
                                                        {item.category ? ` • ${item.category}` : ''}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xl font-semibold text-slate-950">
                                                        {formatCurrency(item.final_price)}
                                                    </p>
                                                    {item.price_discount && (
                                                        <p className="mt-1 text-sm text-slate-400 line-through">
                                                            {formatCurrency(item.price_normal)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {item.is_owned && (
                                                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                                                    Buku ini sudah pernah kamu beli. Saat checkout nanti
                                                    buku akan otomatis dikeluarkan dari daftar bayar.
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <Link
                                                href={item.detail_url}
                                                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Lihat Detail
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item)}
                                                className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-lg font-semibold text-slate-950">Ringkasan</p>
                            <div className="mt-6 space-y-4 text-sm text-slate-600">
                                <div className="flex items-center justify-between">
                                    <span>Total Buku</span>
                                    <span className="font-semibold text-slate-950">
                                        {summary.total_items}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Sudah Dimiliki</span>
                                    <span className="font-semibold text-slate-950">
                                        {summary.owned_items}
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
                                <Link
                                    href={route('checkout.index')}
                                    className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Lanjut Checkout
                                </Link>
                                <Link
                                    href={route('storefront.index')}
                                    className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Tambah Buku Lagi
                                </Link>
                            </div>
                        </aside>
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <p className="text-lg font-semibold text-slate-900">
                            Keranjang kamu masih kosong.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Pilih buku dari katalog, lalu lanjut checkout saat sudah siap.
                        </p>
                        <Link
                            href={route('storefront.index')}
                            className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Jelajahi Katalog
                        </Link>
                    </div>
                )}
            </section>
        </CustomerLayout>
    );
}
