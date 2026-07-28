<?php

use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Customer\MyBookController;
use App\Http\Controllers\Customer\MyOrderController;
use App\Http\Controllers\MidtransNotificationController;
use App\Http\Controllers\MidtransRedirectController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StorefrontController::class, 'index'])->name('storefront.index');
Route::get('/books/search', [StorefrontController::class, 'search'])->name('storefront.search');
Route::get('/books/{book:slug}', [StorefrontController::class, 'show'])->name('storefront.books.show');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::delete('/cart/{bookId}', [CartController::class, 'destroy'])
    ->whereNumber('bookId')
    ->name('cart.destroy');

Route::post('/payments/midtrans/notification', MidtransNotificationController::class)
    ->name('payments.midtrans.notification');

Route::middleware('auth')->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/payments/midtrans/finish', [MidtransRedirectController::class, 'finish'])->name('payments.midtrans.finish');
    Route::get('/payments/midtrans/pending', [MidtransRedirectController::class, 'pending'])->name('payments.midtrans.pending');
    Route::get('/payments/midtrans/error', [MidtransRedirectController::class, 'error'])->name('payments.midtrans.error');

    Route::get('/my-books', [MyBookController::class, 'index'])->name('customer.my-books.index');
    Route::get('/my-orders', [MyOrderController::class, 'index'])->name('customer.my-orders.index');
    Route::get('/my-orders/{order:order_number}', [MyOrderController::class, 'show'])->name('customer.my-orders.show');
    Route::post('/my-orders/{order:order_number}/pay', [MyOrderController::class, 'pay'])->name('customer.my-orders.pay');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('categories', CategoryController::class)->except('show');
        Route::resource('books', BookController::class)->except('show');
        Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
        Route::resource('customers', CustomerController::class)->except('show');
    });
});

require __DIR__.'/auth.php';
