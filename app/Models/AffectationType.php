<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AffectationType extends Model
{
    protected $fillable = [
        'code',
        'name',
        'tax_letter',
        'tax_code',
        'tax_name',
        'tax_type',
        'tax_percentage',
        'importe_icbper',
        'state',
    ];
}
