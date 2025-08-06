<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
     protected $fillable = [
        'user_id',
        'barber_id',
        'rating',
        'comment',
        'service_id',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function barber()
    {
        return $this->belongsTo(Barber::class);
    }
       public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
