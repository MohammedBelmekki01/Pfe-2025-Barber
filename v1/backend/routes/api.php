<?php

use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\BarberController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\StudentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




Route::middleware(['auth:sanctum'])->group(static function () {
  Route::get('/me', function (Request $request) {
    return $request->user();
  });
});

Route::get('/admin/barbers/{id}', [BarberController::class, 'show']);
Route::middleware(['auth:sanctum', 'ability:client'])->prefix('client')->group(static function () {
   Route::get('/barbers/{barber}/reviews', [ReviewController::class, 'index']);
    Route::post('/barbers/{barber}/reviews', [ReviewController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'ability:admin'])->prefix('admin')->group(static function () {

  Route::apiResources([
    'clients' => ClientController::class,
    'barbers' => BarberController::class
  ]);
});

Route::middleware(['auth:sanctum', 'ability:barber'])->prefix('barber')->group(static function () {});
