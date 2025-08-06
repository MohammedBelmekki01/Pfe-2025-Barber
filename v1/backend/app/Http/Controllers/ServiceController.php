<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    // Liste services (client & admin)
public function index(Request $request)
{
    $query = Service::query();

    if ($request->has('barber_id')) {
        $query->where('barber_id', $request->barber_id);
    }

    $services = $query->get();

    return response()->json(['data' => $services]);
}



    // Barber: liste ses services
    public function myServices()
    {
        $barber = auth('barber')->user();
        return response()->json(data: ['data' => Service::where('barber_id', $barber->id)->get()]);
    }

    // Barber: créer service
    public function store(Request $request)
    {
        $barber = auth('barber')->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('services', 'public');
        }

        $validated['barber_id'] = $barber->id;

        return response()->json(Service::create($validated), 201);
    }

    // Barber: modifier service
    public function update(Request $request, $id)
    {
        $barber = auth('barber')->user();
        $service = Service::where('id', $id)->where('barber_id', $barber->id)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Supprimer ancienne image
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $validated['image'] = $request->file('image')->store('services', 'public');
        }

        $service->update($validated);

        return response()->json($service);
    }

    // Barber: supprimer service
    public function destroy($id)
    {
        $barber = auth('barber')->user();
        $service = Service::where('id', $id)->where('barber_id', $barber->id)->firstOrFail();

        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }

        $service->delete();

        return response()->json(['message' => 'Service supprimé']);
    }
}

