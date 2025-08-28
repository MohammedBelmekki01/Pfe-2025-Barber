<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;


class Barber extends Authenticatable
{
    use HasApiTokens, HasFactory, SoftDeletes;

    protected $fillable = [
        'firstname',
        'lastname',
        'date_of_birth',
        'gender',
        'addrees',
        'phone',
        'email',
        'password',
        'bio',
        'experience',
        'location',
        'status',
            'image' // <-- add this

    ];

    protected $appends = ['role'];


    public function getRoleAttribute()
    {
        return 'barber';
    }


    public function reviews()
    {
        return $this->hasMany(Review::class);
    }


    public function services()
    {
        return $this->hasMany(Service::class);
    }
}
