<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LabtestController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/', function (Request $request) {
    // Si el usuario está logueado, lo enviamos al dashboard
    if ($request->user()) {
        return redirect()->route('dashboard');
    }

    // Si no está logueado, lo enviamos al login
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // products
    Route::resource('products', ProductController::class)->except(['create', 'show', 'edit']);
    Route::get('products/{product}', [ProductController::class, 'getProduct'])->name('products.get');
    Route::patch('products/set-status/{product}', [ProductController::class, 'setStatus'])->name('products.set-status');

    // product_types
    Route::resource('product-types', ProductTypeController::class)->except(['create', 'show', 'edit']);

    // lab tests
    Route::resource('labtests', LabtestController::class)->except(['create', 'show', 'edit']);
    Route::get('labtests/{labtest}', [LabtestController::class, 'getLabtest'])->name('labtests.get');
    Route::patch('labtests/set-status/{labtest}', [LabtestController::class, 'setStatus'])->name('labtests.set-status');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
