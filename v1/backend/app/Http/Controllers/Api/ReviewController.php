<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Barber;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreReviewRequest;

class ReviewController extends Controller
{
    public function index(Barber $barber)
    {
        $reviews = $barber->reviews()->with(['user', 'service'])->latest()->get();

        return response()->json($reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'user_id' => $review->user_id,
                'barber_id' => $review->barber_id,
                'displayName' => $review->user->name ?? 'User',
                'customerName' => $review->user->username ?? 'user',
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at,
                'updated_at' => $review->updated_at,
                'service_id' => $review->service_id,
                'service_name' => $review->service->name ?? null,
                'avatar' => $review->user->avatar ?? null,
                'likes' => 0,
                'isLiked' => false,
                'replies' => 0,
                'isVerified' => true
            ];
        }));
    }

    public function store(StoreReviewRequest $request, Barber $barber)
    {
        $data = $request->validated();
        $data['barber_id'] = $barber->id;

        $review = Review::create($data);

        $user = User::find($review->user_id);

        return response()->json([
            'id' => $review->id,
            'user_id' => $review->user_id,
            'barber_id' => $review->barber_id,
            'displayName' => $user->name ?? 'User',
            'customerName' => $user->username ?? 'user',
            'rating' => $review->rating,
            'comment' => $review->comment,
            'created_at' => $review->created_at,
            'updated_at' => $review->updated_at,
            'service_id' => $review->service_id,
            'service_name' => optional($review->service)->name,
            'avatar' => $user->avatar ?? null,
            'likes' => 0,
            'isLiked' => false,
            'replies' => 0,
            'isVerified' => true
        ], 201);
    }
}
