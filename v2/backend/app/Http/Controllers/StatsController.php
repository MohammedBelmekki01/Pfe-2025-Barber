<?php

namespace App\Http\Controllers;

use App\Models\Barber;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function index() {
    return response()->json([
        'users' => User::count(),
        'barbers' => Barber::count(),
        'appointmentsToday' => Reservation::whereDate('reservation_time', now())->count(),
    ]);
}

}
