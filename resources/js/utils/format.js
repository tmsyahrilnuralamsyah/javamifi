export function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

export function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(Number(value || 0));
}
