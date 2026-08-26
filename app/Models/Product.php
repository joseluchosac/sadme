<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'code',
        'name',
        'unit_code',
        'price',
        'min_stock',
        'brand',
        'barcode',
        'affectation_type_id',
        'category_id',
        'description',
        'details',
        'features',
        'observations',
        'notes',
        'show_price',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
        ];
    }

    // Relación uno a uno inversa
    public function category()
    {
        return $this->belongsTo(Category::class);
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
