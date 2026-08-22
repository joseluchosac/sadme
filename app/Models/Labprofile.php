<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Labprofile extends Model
{
    protected $fillable = [
        "code",
        "name",
        "description",
        "status",
    ];
}
