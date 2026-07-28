import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;

    if (flash?.success) {
        return (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {flash.success}
            </div>
        );
    }

    if (flash?.error) {
        return (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {flash.error}
            </div>
        );
    }

    return null;
}
