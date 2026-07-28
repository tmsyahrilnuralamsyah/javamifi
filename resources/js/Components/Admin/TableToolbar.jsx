import { Link } from '@inertiajs/react';

export default function TableToolbar({
    search,
    onSearchChange,
    onSubmit,
    onReset,
    perPage,
    onPerPageChange,
    createHref = null,
    createLabel = null,
    searchPlaceholder = 'Cari data...',
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:max-w-md"
                />

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Cari
                    </button>

                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Reset
                    </button>
                </div>
            </form>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-600">
                        Per halaman
                    </label>
                    <select
                        value={perPage}
                        onChange={(e) => onPerPageChange(e.target.value)}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    >
                        {[10, 25, 50, 100].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {createHref && createLabel && (
                    <Link
                        href={createHref}
                        className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        {createLabel}
                    </Link>
                )}
            </div>
        </div>
    );
}
