<?php

use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\BarberController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StudentController;
use App\Models\Barber;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeUserMail;



Route::middleware(['auth:sanctum'])->group(static function () {
  Route::get('/me', function (Request $request) {
    return $request->user();
  });
});
Route::post('register/clients', [ClientController::class, 'store']);
  Route::get('/services', [ServiceController::class, 'index']);
  Route::get('/barbers', [BarberController::class, 'index']);

Route::post('register/barbers', [BarberController::class, 'store']);
//  Route::get('/barbers/{barber}/reviews', [ReviewController::class, 'index']);
//   Route::post('/barbers/{barber}/reviews', [ReviewController::class, 'store']);


Route::get('/barbers/{barber}/services', function (Barber $barber) {
    return response()->json(['data' => $barber->services()->get()]);
});

// Route::get('/barbers/{id}', action: [BarberController::class, 'show']);
Route::middleware(['auth:sanctum', 'ability:client'])->prefix('client')->group(static function () {
  Route::get('/barbers/{barber}/reviews', action: [ReviewController::class, 'index']);
  Route::put('/profile', [ClientController::class, 'updateProfile']);
  Route::post('/barbers/{barber}/reviews', [ReviewController::class, 'store']);
  Route::get('/barbers/{id}', action: [BarberController::class, 'show']);
  Route::get('/barbers', action: [BarberController::class, 'index']);
  Route::apiResource('reservations', ReservationController::class);
  Route::get('/reservations', [ReservationController::class, 'userReservations']);
  Route::get('/services', [ServiceController::class, 'index']);
      Route::get('/barbers/{barber}/services', [ServiceController::class, 'index']);
  Route::get('/barbers/{barberId}/schedule', [ReservationController::class, 'getBarberReservations']);
});
  Route::get('/barbers/{barberId}/schedule', [ReservationController::class, 'getBarberReservations']);

Route::get('/allreview', [ReviewController::class, 'allReview']);
Route::middleware(['auth:sanctum', 'ability:admin'])->prefix('admin')->group(static function () {
  Route::get('/barbers/{barber}/reviews', action: [ReviewController::class, 'index']);
  Route::get('/reservations', [ReservationController::class, 'allReservations']);
  Route::get('/services', [ServiceController::class, 'index']);

  Route::apiResources([
    'clients' => ClientController::class,
    'barbers' => BarberController::class
  ]);
});

Route::middleware(['auth:sanctum', 'ability:barber'])->prefix('barber')->group(static function () {
  Route::get('/reservations', [BarberController::class, 'myReservations']);
  Route::get('/reviews', [BarberController::class, 'myReviews']);
  Route::put('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
   Route::get('/services', [ServiceController::class, 'myServices']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
    Route::post('/test-email', [MailController::class, 'testEmail']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
Route::put('/profile', [BarberController::class, 'updateProfile']);
    Route::post('/emails/welcome', [MailController::class, 'sendWelcome']);
  });
// Add this outside any middleware groups for testing
Route::post('/test-email', [MailController::class, 'testEmail']);