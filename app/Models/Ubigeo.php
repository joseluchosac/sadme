<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ubigeo extends Model
{
    protected $fillable = [
        "code_inei",
        "code_reniec",
        "departamento",
        "provincia",
        "distrito",
        "status",
        "sort",
    ];
}
