<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Numeration extends Model
{
    protected $fillable = [
        'receipt_type_code',
        'serie',
        'correlative',
        'modify_to_code',
        'state',
    ];
}
