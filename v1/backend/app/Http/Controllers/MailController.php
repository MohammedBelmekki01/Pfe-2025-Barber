<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Admin;
use App\Models\Barber;

use App\Mail\WelcomeUserMail;
use App\Mail\WelcomeAdminMail;
use App\Mail\WelcomeBarberMail;

class MailController extends Controller
{
public function sendWelcome(Request $request)
{
    $user = $request->user(); // Get the authenticated user

    if (!$user) {
        return response()->json(['error' => 'Not authenticated'], 401);
    }

    // Determine the role and send the email
    if ($user instanceof \App\Models\User) {
        Mail::to($user->email)->send(new WelcomeUserMail($user));
    } elseif ($user instanceof \App\Models\Admin) {
        Mail::to($user->email)->send(new WelcomeAdminMail($user));
    } elseif ($user instanceof \App\Models\Barber) {
        Mail::to($user->email)->send(new WelcomeBarberMail($user));
    } else {
        return response()->json(['error' => 'Role not recognized'], 400);
    }

    return response()->json(['message' => 'Welcome email sent successfully', 'recipient_email' => "lahfarimohcine01@gmail.com"]);
}



public function testEmail(Request $request)
{
    try {
        \Log::info('=== Starting testEmail ===');
        
        // Use your specific admin email
        $adminEmail = 'lahfarimohcine01@gmail.com';
        
        \Log::info('Sending email to admin: ' . $adminEmail);
        
        // Create a mock recipient object with your admin data
        $recipient = (object) [
            'email' => $adminEmail,
            'name' => 'Admin User',
            'id' => 1
        ];
        
        // Send the email
        Mail::to($adminEmail)->send(new WelcomeBarberMail($recipient));
        
        \Log::info('Email sent successfully to: ' . $adminEmail);
        
        return response()->json([
            'message' => 'Test email sent successfully to admin',
            'recipient_email' => $adminEmail
        ]);
        
    } catch (\Exception $e) {
        \Log::error('Email sending failed: ' . $e->getMessage());
        return response()->json([
            'error' => $e->getMessage(),
            'details' => 'Check mail configuration'
        ], 500);
    }
}
}
