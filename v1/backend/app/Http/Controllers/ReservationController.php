<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Optionally show user reservations
        $user = Auth::user();
        $reservations = Reservation::where('user_id', $user->id)->with('barber')->get();
        return ReservationResource::collection($reservations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'barber_id' => 'required|exists:barbers,id',
            'reservation_time' => 'required|date|after:now',
            'service' => 'required|string|max:255',
        ]);

        $reservation = Reservation::create([
            'user_id' => Auth::id(),
            'barber_id' => $request->barber_id,
            'reservation_time' => $request->reservation_time,
            'service' => $request->service,
            'status' => 'pending',
        ]);

        return new ReservationResource($reservation);
    }

    public function show($id)
    {
        $reservation = Reservation::with('barber', 'user')->findOrFail($id);
        return new ReservationResource($reservation);
    }

    public function destroy($id)
    {
        $reservation = Reservation::where('user_id', Auth::id())->findOrFail($id);
        $reservation->delete();
        return response()->json(['message' => 'Reservation cancelled']);
    }

    public function userReservations(Request $request)
    {
        $user = $request->user();

        $reservations = Reservation::where('user_id', $user->id)
            ->with('barber')
            ->orderBy('reservation_time', 'desc')
            ->get();

        return response()->json($reservations);
    }
    public function allReservations(Request $request)
    {
        $query = Reservation::query()->with(['user', 'barber']);

        $filterType = $request->input('filterType');
        $filterText = $request->input('filterText');

        if ($filterType && $filterText) {
            if ($filterType === 'client') {
                $query->whereHas('user', function ($q) use ($filterText) {
                    $q->where('name', 'like', "%$filterText%");
                });
            } elseif ($filterType === 'barber') {
                $query->whereHas('barber', function ($q) use ($filterText) {
                    $q->where(DB::raw("CONCAT(firstname, ' ', lastname)"), 'like', "%$filterText%");
                });
            }
        }

        $reservations = $query->get();

        return ReservationResource::collection($reservations);
    }

    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:pending,confirmed,cancelled,done',
    ]);

    $reservation = Reservation::findOrFail($id);

    // Optional: Make sure the authenticated barber owns the reservation
    if ($reservation->barber_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $reservation->status = $request->status;
    $reservation->save();

    return response()->json([
        'message' => 'Status updated successfully',
        'data' => $reservation,
    ]);
}
}
