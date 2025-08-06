<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Service extends Model
{
    use SoftDeletes, HasApiTokens;
    protected $fillable = ['barber_id', 'name', 'description', 'price', 'duration', 'image'];

    public function barber()
    {
        return $this->belongsTo(Barber::class, 'barber_id');
    }
        public function reservation()
    {
        return $this->hasMany(Reservation::class);
    }
            public function review()
    {
        return $this->hasMany(Review::class);
    }
}
