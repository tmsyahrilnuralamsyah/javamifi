<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\User;
use App\Models\UserBook;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function __invoke(): Response
    {
        $paidStatuses = ['paid', 'settlement', 'capture'];
        $today = Carbon::today();
        $startOfMonth = now()->startOfMonth();

        $revenueSeries = $this->getRevenueSeries($paidStatuses, 90);
        $orderSeries = $this->getOrderSeries(90);
        $topBooks = $this->getTopBooks($paidStatuses, 5);

        $stats = [
            'books' => $this->getCount('books', fn () => Book::count()),
            'published_books' => $this->getCount('books', fn () => Book::where('is_published', true)->count()),
            'categories' => $this->getCount('categories', fn () => Category::count()),
            'orders' => $this->getCount('orders', fn () => Order::count()),
            'paid_orders' => $this->getCount('orders', fn () => Order::where('status', 'paid')->count()),
            'pending_orders' => $this->getCount('orders', fn () => Order::where('status', 'pending')->count()),
            'order_failed' => $this->getCount('orders', fn () => Order::where('status', 'failed')->count()),
            'order_expired' => $this->getCount('orders', fn () => Order::where('status', 'expired')->count()),
            'order_cancelled' => $this->getCount('orders', fn () => Order::where('status', 'cancelled')->count()),
            'customers' => $this->getCount('users', fn () => User::where('role', 'customer')->count()),
            'admins' => $this->getCount('users', fn () => User::where('role', 'admin')->count()),
            'payments' => $this->getCount('payments', fn () => Payment::count()),
            'paid_payments' => $this->getCount('payments', fn () => Payment::whereIn('transaction_status', $paidStatuses)->count()),
            'revenue' => $this->getCount('payments', fn () => (float) Payment::whereIn('transaction_status', $paidStatuses)->sum('gross_amount')),
            'revenue_today' => $this->getCount('payments', fn () => (float) Payment::whereIn('transaction_status', $paidStatuses)->whereDate('paid_at', $today)->sum('gross_amount')),
            'revenue_month' => $this->getCount('payments', fn () => (float) Payment::whereIn('transaction_status', $paidStatuses)->where('paid_at', '>=', $startOfMonth)->sum('gross_amount')),
            'user_books' => $this->getCount('user_books', fn () => UserBook::count()),
        ];

        $orderStatusSummary = Schema::hasTable('orders')
            ? Order::query()
                ->selectRaw('status, COUNT(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray()
            : [];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'revenueSeries' => $revenueSeries,
            'orderSeries' => $orderSeries,
            'topBooks' => $topBooks,
            'orderStatusSummary' => [
                'pending' => (int) ($orderStatusSummary['pending'] ?? 0),
                'paid' => (int) ($orderStatusSummary['paid'] ?? 0),
                'failed' => (int) ($orderStatusSummary['failed'] ?? 0),
                'expired' => (int) ($orderStatusSummary['expired'] ?? 0),
                'cancelled' => (int) ($orderStatusSummary['cancelled'] ?? 0),
            ],
        ]);
    }

    /**
     * Return a safe aggregate value even before migrations are executed.
     */
    protected function getCount(string $table, callable $callback): int|float
    {
        if (! Schema::hasTable($table)) {
            return 0;
        }

        return $callback();
    }

    protected function getRevenueSeries(array $paidStatuses, int $days): array
    {
        if (! Schema::hasTable('payments')) {
            return [];
        }

        $startDate = Carbon::today()->subDays($days - 1);
        $endDate = Carbon::today();

        $rows = Payment::query()
            ->selectRaw('DATE(paid_at) as day, SUM(gross_amount) as total')
            ->whereIn('transaction_status', $paidStatuses)
            ->whereNotNull('paid_at')
            ->whereBetween(DB::raw('DATE(paid_at)'), [$startDate->toDateString(), $endDate->toDateString()])
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        return $this->fillDailySeries($rows, $startDate, $endDate);
    }

    protected function getOrderSeries(int $days): array
    {
        if (! Schema::hasTable('orders')) {
            return [];
        }

        $startDate = Carbon::today()->subDays($days - 1);
        $endDate = Carbon::today();

        $rows = Order::query()
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->whereBetween(DB::raw('DATE(created_at)'), [$startDate->toDateString(), $endDate->toDateString()])
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        return $this->fillDailySeries($rows, $startDate, $endDate);
    }

    protected function fillDailySeries(array $rows, Carbon $startDate, Carbon $endDate): array
    {
        $series = [];
        $cursor = $startDate->copy();

        while ($cursor->lte($endDate)) {
            $dayKey = $cursor->toDateString();

            $series[] = [
                'date' => $dayKey,
                'label' => $cursor->translatedFormat('d M'),
                'value' => (float) ($rows[$dayKey] ?? 0),
            ];

            $cursor->addDay();
        }

        return $series;
    }

    protected function getTopBooks(array $paidStatuses, int $limit): array
    {
        if (! Schema::hasTable('order_items') || ! Schema::hasTable('orders') || ! Schema::hasTable('payments')) {
            return [];
        }

        $rows = OrderItem::query()
            ->selectRaw('order_items.book_id, order_items.book_title, COUNT(*) as total_sold, SUM(order_items.final_price) as total_revenue, MAX(books.cover) as cover')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('payments', 'payments.order_id', '=', 'orders.id')
            ->leftJoin('books', 'books.id', '=', 'order_items.book_id')
            ->whereIn('payments.transaction_status', $paidStatuses)
            ->groupBy('order_items.book_id', 'order_items.book_title')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get();

        return $rows->map(fn ($row) => [
            'book_id' => (int) $row->book_id,
            'title' => (string) $row->book_title,
            'total_sold' => (int) $row->total_sold,
            'total_revenue' => (float) $row->total_revenue,
            'cover_url' => $this->resolveCoverUrl($row->cover),
        ])->toArray();
    }

    protected function resolveCoverUrl(?string $cover): ?string
    {
        if (! $cover) {
            return null;
        }

        if (Str::startsWith($cover, ['http://', 'https://', '/'])) {
            return $cover;
        }

        return '/storage/'.$cover;
    }
}
