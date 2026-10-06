<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Admin\AdminBookingController;
use App\Http\Controllers\Api\Admin\AdminMasterDataController;
use App\Http\Controllers\Api\Admin\AdminScheduleController;
use App\Http\Controllers\Api\Admin\AdminServiceCategoryController;
use App\Http\Controllers\Api\Admin\AdminServiceController;
use App\Http\Controllers\Api\Admin\AdminStoreController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Customer\CustomerAddressController;
use App\Http\Controllers\Api\Customer\CustomerBookingController;
use App\Http\Controllers\Api\Customer\CustomerDashboardController;
use App\Http\Controllers\Api\Customer\CustomerLoyaltyController;
use App\Http\Controllers\Api\Customer\CustomerVoucherController;
use App\Http\Controllers\Api\Public\PublicCatalogController;
use App\Http\Controllers\Api\Public\PublicContentController;
use App\Http\Controllers\Api\Public\PublicSettingController;
use App\Http\Controllers\Api\Public\PublicStoreController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Washe
|--------------------------------------------------------------------------
| Konvensi:
|  - Public  : tanpa autentikasi (katalog, konten, pengaturan situs).
|  - Auth    : register/login (publik), me/logout (wajib token Sanctum).
|  - Customer: wajib login + role customer (data milik sendiri).
|  - Admin   : wajib login + role root/admin_cabang (dibatasi per-cabang).
*/

// -------------------------------------------------------------------------
// Public — tanpa autentikasi
// -------------------------------------------------------------------------
Route::prefix('public')->group(function () {
    Route::get('settings', [PublicSettingController::class, 'show']);

    Route::get('services', [PublicCatalogController::class, 'services']);

    Route::get('stores', [PublicStoreController::class, 'index']);
    Route::get('stores/{id}', [PublicStoreController::class, 'show'])->whereNumber('id');

    Route::get('articles', [PublicContentController::class, 'articles']);
    Route::get('articles/{slug}', [PublicContentController::class, 'article']);
    Route::get('faqs', [PublicContentController::class, 'faqs']);
    Route::get('pages/{slug}', [PublicContentController::class, 'page']);
    Route::get('banners', [PublicContentController::class, 'banners']);
    Route::get('company-profile', [PublicContentController::class, 'companyProfile']);
});

// -------------------------------------------------------------------------
// Auth
// -------------------------------------------------------------------------
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

// -------------------------------------------------------------------------
// Customer — butuh login + role customer
// -------------------------------------------------------------------------
Route::prefix('customer')
    ->middleware(['auth:sanctum', 'role:customer'])
    ->group(function () {
        Route::get('dashboard', [CustomerDashboardController::class, 'index']);

        Route::get('bookings', [CustomerBookingController::class, 'index']);
        Route::post('bookings', [CustomerBookingController::class, 'store']);
        Route::get('bookings/{id}', [CustomerBookingController::class, 'show'])->whereNumber('id');
        Route::post('bookings/{id}/cancel', [CustomerBookingController::class, 'cancel'])->whereNumber('id');

        Route::get('addresses', [CustomerAddressController::class, 'index']);
        Route::post('addresses', [CustomerAddressController::class, 'store']);
        Route::put('addresses/{id}', [CustomerAddressController::class, 'update'])->whereNumber('id');
        Route::delete('addresses/{id}', [CustomerAddressController::class, 'destroy'])->whereNumber('id');

        Route::get('loyalty', [CustomerLoyaltyController::class, 'index']);

        Route::get('vouchers', [CustomerVoucherController::class, 'catalog']);
        Route::get('vouchers/mine', [CustomerVoucherController::class, 'mine']);
        Route::post('vouchers/redeem', [CustomerVoucherController::class, 'redeem']);
    });

// -------------------------------------------------------------------------
// Admin — butuh login + role root/admin_cabang
// -------------------------------------------------------------------------
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'role:root,admin_cabang'])
    ->group(function () {
        // Bookings
        Route::get('bookings', [AdminBookingController::class, 'index']);
        Route::get('bookings/{id}', [AdminBookingController::class, 'show'])->whereNumber('id');
        Route::patch('bookings/{id}/status', [AdminBookingController::class, 'updateStatus'])->whereNumber('id');

        // Stores
        Route::get('stores', [AdminStoreController::class, 'index']);
        Route::post('stores', [AdminStoreController::class, 'store']);
        Route::get('stores/{id}', [AdminStoreController::class, 'show'])->whereNumber('id');
        Route::put('stores/{id}', [AdminStoreController::class, 'update'])->whereNumber('id');
        Route::delete('stores/{id}', [AdminStoreController::class, 'destroy'])->whereNumber('id');

        // Services (per store)
        Route::get('services', [AdminServiceController::class, 'index']);
        Route::post('services', [AdminServiceController::class, 'store']);
        Route::get('services/{id}', [AdminServiceController::class, 'show'])->whereNumber('id');
        Route::put('services/{id}', [AdminServiceController::class, 'update'])->whereNumber('id');
        Route::delete('services/{id}', [AdminServiceController::class, 'destroy'])->whereNumber('id');

        // Service categories (per store)
        Route::get('service-categories', [AdminServiceCategoryController::class, 'index']);
        Route::post('service-categories', [AdminServiceCategoryController::class, 'store']);
        Route::put('service-categories/{id}', [AdminServiceCategoryController::class, 'update'])->whereNumber('id');
        Route::delete('service-categories/{id}', [AdminServiceCategoryController::class, 'destroy'])->whereNumber('id');

        // Order schedules (per store)
        Route::get('schedules', [AdminScheduleController::class, 'index']);
        Route::post('schedules', [AdminScheduleController::class, 'store']);
        Route::put('schedules/{id}', [AdminScheduleController::class, 'update'])->whereNumber('id');
        Route::delete('schedules/{id}', [AdminScheduleController::class, 'destroy'])->whereNumber('id');

        // Global master data (units & service types)
        Route::get('units', [AdminMasterDataController::class, 'units']);
        Route::post('units', [AdminMasterDataController::class, 'storeUnit']);
        Route::put('units/{id}', [AdminMasterDataController::class, 'updateUnit'])->whereNumber('id');
        Route::delete('units/{id}', [AdminMasterDataController::class, 'destroyUnit'])->whereNumber('id');

        Route::get('service-types', [AdminMasterDataController::class, 'serviceTypes']);
        Route::post('service-types', [AdminMasterDataController::class, 'storeServiceType']);
        Route::put('service-types/{id}', [AdminMasterDataController::class, 'updateServiceType'])->whereNumber('id');
        Route::delete('service-types/{id}', [AdminMasterDataController::class, 'destroyServiceType'])->whereNumber('id');
    });
