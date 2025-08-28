<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
// use Illuminate\Contracts\Queue\ShouldQueue; // uncomment if using queues

class WelcomeBarberMail extends Mailable /* implements ShouldQueue */
{
    use Queueable, SerializesModels;

    public $recipient;

    public function __construct($recipient)
    {
        $this->recipient = $recipient;
    }

    public function build()
    {
        return $this->subject('Bienvenue sur notre plateforme')
            ->markdown('emails.barber.welcome', [
                'name' => $this->recipient->name ?? ($this->recipient->firstname ?? 'Utilisateur'),
            ]);
    }
}
