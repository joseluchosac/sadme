<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('/pub/precios', [ProductController::class, 'getPrices'])->name('pub.precios');

// Route::get('/', function (Request $request) {
// Si el usuario está logueado, lo enviamos al dashboard
// if ($request->user()) {
//     return redirect()->route('dashboard');
// }

// Si no está logueado, lo enviamos al login
// return redirect()->route('login');
// })->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // products
    Route::resource('products', ProductController::class)->except(['create', 'show', 'edit']);
    Route::get('products/{product}', [ProductController::class, 'getProduct'])->name('products.get');
    Route::patch('products/set-status/{product}', [ProductController::class, 'setStatus'])->name('products.set-status');
    Route::get('products/product-pdf/{product}', [ProductController::class, 'productPdf'])->name('products.product-pdf');

    // categories
    Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);

    // catalogs
});

Route::get('catalogs/get-units', [CatalogController::class, 'getUnits'])->name('catalogs.get-units');
Route::get('catalogs/get-affectation-types', [CatalogController::class, 'getAffectationTypes'])->name('catalogs.get-affectation-types');
Route::get('categories/get-all', [CategoryController::class, 'getAll'])->name('categories.get-all');
Route::get('products/pub/{product}', [ProductController::class, 'getProductPublic'])->name('products-pub.get');
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
