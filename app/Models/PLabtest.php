<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PLabtest extends Model
{
    protected $fillable = [
        'product_id',
        'description',
        'sirve',
        'resultado',
        'muestra',
        'area',
        'exams',
    ];
}
