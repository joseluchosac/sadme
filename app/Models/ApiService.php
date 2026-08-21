<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiService extends Model
{
    protected $fillable = [
        'service',
        'provider',
        'url',
        'method',
        'token',
        'token_type',
        'default',
        'details',
        'status',
    ];
}
