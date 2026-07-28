<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of the customers.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $sort = $request->string('sort')->toString() ?: 'created_at';
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';
        $perPage = (int) $request->integer('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;
        $sortable = ['name', 'email', 'orders_count', 'user_books_count', 'created_at'];

        $customers = User::query()
            ->where('role', 'customer')
            ->withCount(['orders', 'userBooks'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy(in_array($sort, $sortable, true) ? $sort : 'created_at', $direction)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (User $customer) => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'google_id' => $customer->google_id,
                'orders_count' => $customer->orders_count,
                'user_books_count' => $customer->user_books_count,
                'created_at' => $customer->created_at?->format('d M Y H:i'),
            ]);

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new customer.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Customers/Create');
    }

    /**
     * Store a newly created customer in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => 'customer',
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()
            ->route('admin.customers.index')
            ->with('success', 'Customer berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified customer.
     */
    public function edit(User $customer): Response
    {
        abort_unless($customer->role === 'customer', 404);

        return Inertia::render('Admin/Customers/Edit', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'google_id' => $customer->google_id,
            ],
        ]);
    }

    /**
     * Update the specified customer in storage.
     */
    public function update(Request $request, User $customer): RedirectResponse
    {
        abort_unless($customer->role === 'customer', 404);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($customer->id),
            ],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        $customer->name = $validated['name'];
        $customer->email = $validated['email'];

        if (! empty($validated['password'])) {
            $customer->password = Hash::make($validated['password']);
        }

        $customer->save();

        return redirect()
            ->route('admin.customers.index')
            ->with('success', 'Customer berhasil diperbarui.');
    }

    /**
     * Remove the specified customer from storage.
     */
    public function destroy(User $customer): RedirectResponse
    {
        abort_unless($customer->role === 'customer', 404);

        if ($customer->orders()->exists() || $customer->userBooks()->exists()) {
            return redirect()
                ->route('admin.customers.index')
                ->with('error', 'Customer tidak bisa dihapus karena sudah memiliki transaksi.');
        }

        $customer->delete();

        return redirect()
            ->route('admin.customers.index')
            ->with('success', 'Customer berhasil dihapus.');
    }
}
