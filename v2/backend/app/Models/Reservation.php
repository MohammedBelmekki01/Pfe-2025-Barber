<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Reservation extends Model
{
      use HasFactory, HasApiTokens;
        protected $fillable = [
        'user_id',
        'barber_id',
        'reservation_time',
        'service',
        'status',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function barber() {
        return $this->belongsTo(Barber::class);
    }
}
