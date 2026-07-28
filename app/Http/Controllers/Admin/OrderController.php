<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $sort = $request->string('sort')->toString() ?: 'created_at';
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';
        $perPage = (int) $request->integer('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;
        $sortable = ['order_number', 'grand_total', 'status', 'paid_at', 'created_at'];

        $orders = Order::query()
            ->with(['user:id,name,email', 'payment:id,order_id,payment_number,payment_type,transaction_status'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('order_number', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($userQuery) => $userQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->orderBy(in_array($sort, $sortable, true) ? $sort : 'created_at', $direction)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user?->name ?? '-',
                'customer_email' => $order->user?->email ?? '-',
                'status' => $order->status,
                'grand_total' => (float) $order->grand_total,
                'payment_number' => $order->payment?->payment_number,
                'payment_type' => $order->payment?->payment_type,
                'payment_status' => $order->payment?->transaction_status,
                'paid_at' => $order->paid_at?->format('d M Y H:i'),
                'created_at' => $order->created_at?->format('d M Y H:i'),
            ]);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ]);
    }
}
