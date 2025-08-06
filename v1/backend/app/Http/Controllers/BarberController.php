<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReservationResource;
use App\Models\Barber;
use App\Http\Requests\StoreBarberRequest;
use App\Http\Requests\UpdateBarberRequest;
use App\Http\Resources\BarberResource;
use App\Http\Resources\ReviewResource;
use App\Models\Reservation;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class BarberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Request $request)
{
    $query = Barber::query();

    if ($request->has('search')) {
        $search = $request->search;

        $query->where(function ($q) use ($search) {
            $q->where('firstname', 'LIKE', "%{$search}%")
              ->orWhere('lastname', 'LIKE', "%{$search}%")
              ->orWhere('email', 'LIKE', "%{$search}%")
              ->orWhere('location', 'LIKE', "%{$search}%");
        });
    }

    $barbers = $query->get();

    return response()->json(['data' => $barbers]);
}

    public function myReviews()
    {
        $barberId = auth()->id();

        $reviews = Review::with('user')
            ->where('barber_id', $barberId)
            ->latest()
            ->get();

        return ReviewResource::collection($reviews);
    }

    // Get reviews for the authenticated barber
    public function myReservations(Request $request)
    {
        $barberId = auth()->id(); // authenticated barber
        $query = Reservation::with(['user','service'])
            ->where('barber_id', $barberId);

        // Optional filter by client name
        if ($request->has('name')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->name . '%');
            });
        }

        // Sort by latest
        $reservations = $query->orderByDesc('reservation_time')->paginate(10);

        return ReservationResource::collection($reservations);
    }

    /**
     * Show the form for creating a new resource.
     */


    /**
     * Store a newly created resource in storage.
     */
     public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname'    => 'required|string|max:255',
            'lastname'     => 'required|string|max:255',
            'date_of_birth'=> 'required|date',
            'gender'       => 'required|in:m,f',
            'addrees'      => 'required|string|max:255',
            'phone'        => 'required|string|max:20',
            'email'        => 'required|email|unique:barbers,email',
            'password'     => 'required|string|min:6',
            'bio'          => 'nullable|string',
            'experience'   => 'nullable|string',
            'location'     => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['status'] = 'pending';

        $barber = Barber::create($validated);

        return response()->json(['message' => 'Barber created successfully', 'barber' => $barber], 201);
    }

    // 🗓️ Update barber (admin or self)
    public function update(Request $request, $id)
    {
        $barber = Barber::findOrFail($id);

        $validated = $request->validate([
            'firstname'    => 'sometimes|string|max:255',
            'lastname'     => 'sometimes|string|max:255',
            'date_of_birth'=> 'sometimes|date',
            'gender'       => 'sometimes|in:m,f',
            'addrees'      => 'sometimes|string|max:255',
            'phone'        => 'sometimes|string|max:20',
            'email'        => 'sometimes|email|unique:barbers,email,' . $id,
            'password'     => 'string|min:6',
            'bio'          => 'nullable|string',
            'experience'   => 'nullable|string',
            'location'     => 'nullable|string',
            'status'       => 'sometimes|in:pending,confirmed,cancelled,done',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $barber->update($validated);

        return response()->json(['message' => 'Barber updated successfully', 'barber' => $barber]);
    }

    // ❌ Delete barber (admin)
    public function destroy($id)
    {
        $barber = Barber::findOrFail($id);
        $barber->delete();

        return response()->json(['message' => 'Barber deleted successfully']);
    }
    public function show($id)
    {
        $barber = Barber::with('services')->find($id);

        if (!$barber) {
            return response()->json(['message' => 'Barber not found'], 404);
        }

        return response()->json($barber);
    }


    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */

}
