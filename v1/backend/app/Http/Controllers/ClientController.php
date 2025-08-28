<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientUserResource;
use App\Models\Barber;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ClientController extends Controller
{
    public function index()
    {
        $clients = User::all();
        return ClientUserResource::collection($clients);
        // define columns
        // $columns = $request->get('columns');
        // return ClientUserResource::collection(User::all($columns));
    }

    public function store(StoreClientRequest $request)
    {

        $formFields = $request->validated();
        $formFields['password'] = Hash::make($formFields['password']);
        $client = User::create($formFields);
        $response = new ClientUserResource($client);
        return response()->json([
            'message' => 'Client created successfully.',
            'client'    => $response,
        ], 201);
    }


    public function update(UpdateClientRequest $request, User $client)
    {
        $formFields = $request->validated();

        if (!empty($formFields['password'])) {
            $formFields['password'] = Hash::make($formFields['password']);
        } else {
            unset($formFields['password']);
        }

        $client->update($formFields);

        return response()->json([
            'message' => 'Client updated successfully.',
            'client' => new ClientUserResource($client),
        ]);
    }

public function updateProfile(UpdateClientRequest $request)
{
    // Get the authenticated client
    $client = auth()->user();

    if (!$client) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // Validate request data using your existing form request
    $formFields = $request->validated();

    // Hash password if provided
    if (!empty($formFields['password'])) {
        $formFields['password'] = Hash::make($formFields['password']);
    } else {
        unset($formFields['password']);
    }



    $client->update($formFields);

    return response()->json([
        'message' => 'Client profile updated successfully.',
        'client' => new ClientUserResource($client),
    ]);
}

    public function destroy(User $client)
    {
        $client->delete();

        return response()->json([
            'message' => 'Client deleted successfully.',
            'data' => new ClientUserResource($client),
        ]);
    }

    public function show(User $client)
    {
        return response()->json($client);
    }


}
