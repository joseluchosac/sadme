<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'seccion', 
        'ordinal', 
        'campo', 
        'campo_desc', 
        'valor',
    ];
}
