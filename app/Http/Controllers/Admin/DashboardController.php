<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function __invoke(): Response
    {
        $stats = [
            'books' => $this->getCount('books', fn () => Book::count()),
            'categories' => $this->getCount('categories', fn () => Category::count()),
            'orders' => $this->getCount('orders', fn () => Order::count()),
            'admins' => $this->getCount('users', fn () => User::where('role', 'admin')->count()),
            'revenue' => $this->getCount('payments', fn () => (float) Payment::where('transaction_status', 'paid')->sum('gross_amount')),
        ];

        $recentOrders = Schema::hasTable('orders')
            ? Order::query()
                ->with('user:id,name,email')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn (Order $order) => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user?->name ?? 'Admin',
                    'customer_email' => $order->user?->email ?? '-',
                    'status' => $order->status,
                    'grand_total' => (float) $order->grand_total,
                    'created_at' => $order->created_at?->format('d M Y H:i'),
                ])
            : collect();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
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
}
