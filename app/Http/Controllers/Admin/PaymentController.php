<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Display a listing of the payments.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $sort = $request->string('sort')->toString() ?: 'created_at';
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';
        $perPage = (int) $request->integer('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;
        $sortable = ['payment_number', 'gross_amount', 'transaction_status', 'paid_at', 'created_at'];

        $payments = Payment::query()
            ->with(['order:id,user_id,order_number', 'order.user:id,name,email'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('payment_number', 'like', "%{$search}%")
                        ->orWhere('transaction_status', 'like', "%{$search}%")
                        ->orWhereHas('order', fn ($orderQuery) => $orderQuery
                            ->where('order_number', 'like', "%{$search}%")
                            ->orWhereHas('user', fn ($userQuery) => $userQuery
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")));
                });
            })
            ->orderBy(in_array($sort, $sortable, true) ? $sort : 'created_at', $direction)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Payment $payment) => [
                'id' => $payment->id,
                'payment_number' => $payment->payment_number,
                'order_number' => $payment->order?->order_number,
                'customer_name' => $payment->order?->user?->name ?? '-',
                'customer_email' => $payment->order?->user?->email ?? '-',
                'payment_type' => $payment->payment_type,
                'gross_amount' => (float) $payment->gross_amount,
                'transaction_status' => $payment->transaction_status,
                'paid_at' => $payment->paid_at?->format('d M Y H:i'),
                'created_at' => $payment->created_at?->format('d M Y H:i'),
            ]);

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ]);
    }
}
