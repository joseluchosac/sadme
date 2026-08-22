<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabtestPrice extends Model
{
    protected $fillable = [
        "labtest_id",
        "price",
        "concept",
        "status",
    ];
}
