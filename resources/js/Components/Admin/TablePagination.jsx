import { Link } from '@inertiajs/react';

export default function TablePagination({ paginated }) {
    if (!paginated || (paginated.last_page ?? 1) <= 1) {
        return null;
    }

    return (
        <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
                Menampilkan {paginated.from ?? 0} sampai {paginated.to ?? 0}{' '}
                dari {paginated.total ?? 0} data
            </p>

            <div className="flex flex-wrap gap-2">
                {paginated.links?.map((link, index) => (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url || '#'}
                        preserveScroll
                        className={`inline-flex min-w-10 items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition ${
                            link.active
                                ? 'bg-slate-950 text-white'
                                : link.url
                                  ? 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                                  : 'cursor-not-allowed border border-slate-100 text-slate-300'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
