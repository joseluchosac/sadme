<?php

namespace App\Http\Controllers;

use App\Models\AffectationType;
use App\Models\Category;
use App\Models\Unit;

class CatalogController extends Controller
{
    public function getUnits()
    {
        $units = Unit::select(['id', 'code', 'abb', 'name', 'status'])->get();

        return response()->json($units);
    }

    public function getAffectationTypes()
    {
        $affectationTypes = AffectationType::select(['id', 'code', 'name', 'tax_letter', 'tax_code', 'tax_name', 'tax_type', 'tax_percentage', 'importe_icbper', 'status'])->get();

        return response()->json($affectationTypes);
    }

    public function getCategories()
    {
        $data = Category::select(['id', 'name'])->get();

        return response()->json($data);
    }
}
