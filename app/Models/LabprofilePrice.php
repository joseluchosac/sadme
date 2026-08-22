<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabprofilePrice extends Model
{
    protected $fillable = [
        "labprofile_id",
        "price",
        "concept",
        "status",
    ];
}
