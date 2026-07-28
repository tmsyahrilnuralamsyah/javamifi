<?php

use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'admin'])
    ->name('dashboard');

Route::middleware(['auth', 'admin'])->group(function () {
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
