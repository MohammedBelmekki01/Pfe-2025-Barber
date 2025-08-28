<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // 🔧 FIX: Utiliser auth()->id() au lieu de $this->client->id
        $userId = auth()->id();
        
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'addrees' => ['required', 'string', 'max:255'],
            'phone' => [
                'required',
                'string',
                'size:10',
                Rule::unique('users', 'phone')->ignore($userId),
            ],
            'password' => ['nullable', 'string', 'min:6', 'max:255'] // 🔧 ADD: nullable + min:6
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'name.max' => 'Name must not exceed 255 characters',
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'This email is already taken by another user',
            'addrees.required' => 'Address is required',
            'addrees.max' => 'Address must not exceed 255 characters',
            'phone.required' => 'Phone number is required',
            'phone.size' => 'Phone number must be exactly 10 digits',
            'phone.unique' => 'This phone number is already taken by another user',
            'password.min' => 'Password must be at least 6 characters',
            'password.max' => 'Password must not exceed 255 characters',
        ];
    }
}