<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Barber;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Barber $barber)
    {
        $reviews = $barber->reviews()->with('user')->get();
        return ReviewResource::collection($reviews);
    }

    // Store a new review for a barber
    public function store(StoreReviewRequest $request, Barber $barber)
    {
        $user = $request->user(); // Authenticated user

        $review = new Review($request->validated());
        $review->user_id = $user->id;
        $review->barber_id = $barber->id;
        $review->save();

        return new ReviewResource($review->load('user'));
    }

    /**
     * Store a newly created resource in storage.
     */

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
