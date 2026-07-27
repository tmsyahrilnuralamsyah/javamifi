import { Link } from '@inertiajs/react';

const defaultHighlights = [
    'Dashboard admin modern dengan React + Tailwind.',
    'Autentikasi admin siap dipakai untuk pengembangan modul berikutnya.',
    'Tampilan responsif untuk desktop dan mobile.',
];

export default function GuestLayout({
    children,
    title = 'Masuk ke admin panel',
    subtitle = 'Kelola katalog buku, pesanan, dan pembayaran dari satu tempat.',
    highlights = defaultHighlights,
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative hidden overflow-hidden lg:flex">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.3),_transparent_35%)]" />
                    <div className="absolute inset-0 bg-slate-950/80" />

                    <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
                        <div className="max-w-xl">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                                    <span className="text-lg font-bold text-white">
                                        JM
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                                        Javamifi
                                    </p>
                                    <p className="text-sm text-slate-300">
                                        Ebook Admin Panel
                                    </p>
                                </div>
                            </Link>

                            <div className="mt-20 space-y-6">
                                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-slate-200">
                                    Referensi gaya TailAdmin
                                </span>
                                <h1 className="text-4xl font-semibold leading-tight text-white xl:text-5xl">
                                    Kelola bisnis ebook dengan tampilan admin
                                    yang bersih dan modern.
                                </h1>
                                <p className="max-w-lg text-base leading-7 text-slate-300">
                                    Area admin ini disiapkan untuk pengelolaan
                                    kategori, buku, pesanan, dan pembayaran
                                    dalam satu dashboard yang nyaman dipakai.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-3">
                            {highlights.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                                >
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300">
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
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm leading-6 text-slate-200">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
                    <div className="w-full max-w-xl">
                        <div className="mb-8 lg:hidden">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                                    <span className="text-base font-bold text-white">
                                        JM
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                                        Javamifi
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Ebook Admin Panel
                                    </p>
                                </div>
                            </Link>
                        </div>

                        <div className="rounded-[2rem] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-slate-950/30 sm:p-8">
                            <div className="mb-8">
                                <p className="text-sm font-medium uppercase tracking-[0.25em] text-sky-600">
                                    Admin Access
                                </p>
                                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                                    {title}
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    {subtitle}
                                </p>
                            </div>

                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
