<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'code',
        'name',
        'product_type_id',
        'unit_code',
        'price',
        'min_stock',
        'brand',
        'barcode',
        'affectation_type_id',
        'description',
        'details',
        'status',
    ];

    // Relación uno a uno inversa
    public function productType()
    {
        return $this->belongsTo(ProductType::class);
    }

    // Relación uno a uno inversa
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_code', 'code');
    }

    // Relación uno a uno
    public function pLabtest()
    {
        return $this->hasOne(PLabtest::class);
    }
}
