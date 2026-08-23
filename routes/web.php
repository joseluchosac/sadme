<?php

use App\Http\Controllers\CatalogController;
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
    Route::get('product-types/get-all', [ProductTypeController::class, 'getAll'])->name('product-types.get-all');

    // catalogs
    Route::get('catalogs/get-units', [CatalogController::class, 'getUnits'])->name('catalogs.get-units');
    Route::get('catalogs/get-affectation-types', [CatalogController::class, 'getAffectationTypes'])->name('catalogs.get-affectation-types');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
