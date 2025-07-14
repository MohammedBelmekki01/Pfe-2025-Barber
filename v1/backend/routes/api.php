<?php

use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\BarberController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\StudentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;




Route::middleware(['auth:sanctum'])->group(static function () {
  Route::get('/me', function (Request $request) {
    return $request->user();
  });
});
//  Route::get('/barbers/{barber}/reviews', [ReviewController::class, 'index']);
//   Route::post('/barbers/{barber}/reviews', [ReviewController::class, 'store']);


// Route::get('/barbers/{id}', action: [BarberController::class, 'show']);
Route::middleware(['auth:sanctum', 'ability:client'])->prefix('client')->group(static function () {
  Route::get('/barbers/{barber}/reviews', action: [ReviewController::class, 'index']);
  Route::post('/barbers/{barber}/reviews', [ReviewController::class, 'store']);
  Route::get('/barbers/{id}', action: [BarberController::class, 'show']);
  Route::get('/barbers', action: [BarberController::class, 'index']);
    Route::apiResource('reservations', ReservationController::class);
 Route::get('/reservations', [ReservationController::class, 'userReservations']);


});
Route::post('register/clients',[ClientController::class, 'store']);
Route::middleware(['auth:sanctum', 'ability:admin'])->prefix('admin')->group(static function () {
  Route::get('/barbers/{barber}/reviews', action: [ReviewController::class, 'index']);
    Route::get('/reservations', [ReservationController::class, 'allReservations']);

  Route::apiResources([
    'clients' => ClientController::class,
    'barbers' => BarberController::class
  ]);
});

Route::middleware(['auth:sanctum', 'ability:barber'])->prefix('barber')->group(static function () {
   Route::get('/reservations', [BarberController::class, 'myReservations']);
    Route::get('/reviews', [BarberController::class, 'myReviews']);
        Route::put('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);

});
