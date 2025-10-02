<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $guards = ['web', 'barber', 'admin'];
        $user = null;
        $guardName = null;

        foreach ($guards as $guard) {
            $currentGuard = Auth::guard($guard);
            if ($currentGuard->check()) {
                $user = $currentGuard->user();
                $guardName = $guard;
                break;
            }
        }

        // Check status only for barber login
        if ($guardName === 'barber' && $user->status !== 'confirmed') {
            Auth::guard($guardName)->logout();
            return response()->json([
                'message' => 'Votre compte n\'est pas encore confirmé.',
            ], 403);
        }

        $request->session()->regenerate();
        
        return response()->json([
            'user' => $user,
            'token' => $user->createToken('api', [$user->getRoleAttribute()])->plainTextToken,
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $guards = ['web', 'barber', 'admin'];
        $user = null;

        foreach ($guards as $guard) {
            $currentGuard = Auth::guard($guard);
            if ($currentGuard->check()) {
                $user = $currentGuard->user();
                break;
            }
        }

        if ($user) {
            $user->tokens()->delete();
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        // $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
