export default function SortableHeader({
    label,
    sortKey = null,
    currentSort,
    currentDirection,
    onSort,
    className = '',
}) {
    const isActive = sortKey && currentSort === sortKey;
    const icon = !isActive ? '↕' : currentDirection === 'asc' ? '↑' : '↓';

    if (!sortKey) {
        return <span className={className}>{label}</span>;
    }

    return (
        <button
            type="button"
            onClick={() => onSort(sortKey)}
            className={`inline-flex items-center gap-2 ${className}`}
        >
            <span>{label}</span>
            <span className={isActive ? 'text-sky-600' : 'text-slate-400'}>
                {icon}
            </span>
        </button>
    );
}
