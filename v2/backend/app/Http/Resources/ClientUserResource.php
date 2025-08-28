<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'name'     => $this->name,
            'email'    => $this->email,
            'addrees'  => $this->addrees,
            'phone'    => $this->phone,
            'updated_at' => $this->updated_at ? $this->updated_at->toDateTimeString() : null,
            'formatted_updated_at' => $this->updated_at->diffForHumans(),
        ];
    }
}
