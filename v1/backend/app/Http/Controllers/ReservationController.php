<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Service;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Optionally show user reservations
        $user = Auth::user();
        $reservations = Reservation::where('user_id', $user->id)
            ->with(['barber', 'service'])
            ->get();
        return ReservationResource::collection($reservations);
    }

    public function store(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'barber_id' => 'required|exists:barbers,id',
                'service_id' => 'required|exists:services,id',
                'reservation_time' => [
                    'required',
                    'date',
                    'after:now',
                    function ($attribute, $value, $fail) {
                        // Check if reservation is being made during business hours (e.g., 9 AM to 8 PM)
                        $time = Carbon::parse($value);
                        if ($time->hour < 9 || $time->hour >= 20) {
                            $fail('Reservations can only be made between 9 AM and 8 PM.');
                        }
                    },
                ]
            ]);

            // Get service details
            $service = Service::findOrFail($validated['service_id']);
            $startTime = Carbon::parse($validated['reservation_time']);
            $endTime = $startTime->copy()->addMinutes($service->duration);

            // Check for overlapping reservations
            $overlappingReservations = Reservation::where('barber_id', $validated['barber_id'])
                ->where('status', '!=', 'cancelled')
                ->where(function ($query) use ($startTime, $endTime) {
                    $query->where(function ($q) use ($startTime, $endTime) {
                        $q->where('reservation_time', '<', $endTime)
                          ->whereRaw('DATE_ADD(reservation_time, INTERVAL (
                              SELECT duration FROM services 
                              WHERE services.id = reservations.service_id
                          ) MINUTE) > ?', [$startTime]);
                    });
                })
                ->exists();

            if ($overlappingReservations) {
                return response()->json([
                    'message' => 'This time slot is already booked. Please choose another time.',
                    'available_time_range' => [
                        'start' => $startTime->format('Y-m-d H:i:s'),
                        'end' => $endTime->format('Y-m-d H:i:s')
                    ]
                ], 422);
            }

            // Check if user already has a pending or confirmed reservation for the same day
            $existingReservation = Reservation::where('user_id', Auth::id())
                ->whereDate('reservation_time', $startTime->toDateString())
                ->whereIn('status', ['pending', 'confirmed'])
                ->exists();

            if ($existingReservation) {
                return response()->json([
                    'message' => 'You already have a reservation for this day.'
                ], 422);
            }

            // Create reservation
            $reservation = Reservation::create([
                'user_id' => Auth::id(),
                'barber_id' => $validated['barber_id'],
                'service_id' => $validated['service_id'],
                'reservation_time' => $validated['reservation_time'],
                'status' => 'pending'
            ]);

            // Load relationships for the resource
            $reservation->load(['barber', 'service', 'user']);

            return new ReservationResource($reservation);

        } catch (\Exception $e) {
            \Log::error('Reservation creation failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create reservation',
                'error' => $e->getMessage()
            ], 500);
        }
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
            ->with(['barber', 'service'])
            ->orderBy('reservation_time', 'desc')
            ->get();

        return response()->json($reservations);
    }
    public function allReservations(Request $request)
    {
        $query = Reservation::query()->with(['user', 'barber','service']);

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

    public function getBarberReservations($barberId)
    {
        try {
            // First verify if barber exists
            $barberExists = \App\Models\Barber::find($barberId);
            if (!$barberExists) {
                return response()->json([
                    'message' => 'Barber not found'
                ], 404);
            }

            $reservations = Reservation::where('barber_id', $barberId)
                ->where('status', '!=', 'cancelled')
                ->with(['service', 'user'])
                ->orderBy('reservation_time', 'asc')
                ->get();

            // Check if any reservations exist
            if ($reservations->isEmpty()) {
                return response()->json([
                    'data' => [],
                    'message' => 'No reservations found for this barber'
                ]);
            }

            $formattedReservations = $reservations->map(function ($reservation) {
                try {
                    return [
                        'id' => $reservation->id,
                        'start_time' => $reservation->reservation_time,
                        'end_time' => Carbon::parse($reservation->reservation_time)
                            ->addMinutes($reservation->service->duration),
                        'service_name' => $reservation->service->name ?? 'N/A',
                        'duration' => $reservation->service->duration ?? 0,
                        'status' => $reservation->status
                    ];
                } catch (\Exception $e) {
                    \Log::error('Error formatting reservation: ' . $e->getMessage());
                    return null;
                }
            })->filter();

            return response()->json([
                'data' => $formattedReservations,
                'barber_id' => $barberId
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in getBarberReservations: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while fetching reservations',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
