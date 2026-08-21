<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// users
Route::resource("users", UserController::class)->except(['create','show','edit']);
Route::get('users/get/{user}', [UserController::class, 'getUser'])->name('users.get');
// roles
Route::resource("roles", RoleController::class)->except(['create','show','edit']);
Route::get('roles/get/{role}', [RoleController::class, 'getRole'])->name('roles.get');
Route::get('roles/get-all', [RoleController::class, 'getAllRoles'])->name('roles.get-all');
// permissions
Route::resource("permissions", PermissionController::class)->except(['create','show','edit']);
Route::get('permissions/get/{role}', [PermissionController::class, 'getPermission'])->name('permissions.get');
Route::get('permissions/get-all', [PermissionController::class, 'getAllPermissions'])->name('permissions.get-all');
