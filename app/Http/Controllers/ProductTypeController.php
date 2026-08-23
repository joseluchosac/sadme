<?php

namespace App\Http\Controllers;

use App\Models\ProductType;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductTypeController extends Controller
{
    private $flash = ['msg' => '', 'type' => 'error', 'action' => '', 'data' => null];

    public function index(Request $request)
    {
        $productTypes = ProductType::query();

        /* SEARCH */
        if ($request->filled('search')) {
            $productTypes->where(function ($query) use ($request) {
                $query->where('code', 'like', '%'.$request->search.'%')
                    ->orWhere('name', 'like', '%'.$request->search.'%');
            });
        }

        /* SORT */
        if ($request->filled('sortby')) {
            $sortby = explode('-', $request->sortby);
            $productTypes->orderBy($sortby[0], $sortby[1] ?? 'asc');
        } else {
            $productTypes->orderBy('name', 'asc');
        }

        $perPage = (int) ($request->per_page ?? 50);
        if ($perPage < 2 || $perPage > 200) {
            $perPage = 10;
        }

        $productTypes = $productTypes->paginate($perPage)->onEachSide(1)->withQueryString();

        return Inertia::render('product-types/index', [
            'productTypes' => $productTypes,
            'qrystr' => $request->only(['search', 'sortby', 'page', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $this->flash['action'] = 'createProductType';
            $request->validate([
                'code' => 'required|max:6|unique:product_types,code',
                'name' => 'required|max:50|unique:product_types,name',
            ], [
                'code.required' => 'El código del tipo de producto es requerido',
                'code.max' => 'El codigo del tipo de producto debe tener como maximo 6 dígitos',
                'code.unique' => 'El código del tipo de producto debe ser único',
                'name.required' => 'El nombre es requerido',
                'name.max' => 'El nombre del tipo de producto debe tener como máximo 50 dígitos',
                'name.unique' => 'El nombre del tipo de producto debe ser único',
            ]);

            $productType = ProductType::create([
                'code' => $request->input('code'),
                'name' => $request->input('name'),
            ]);

            if ($productType) {
                $this->flash['msg'] = 'El tipo de producto fue creado';
                $this->flash['type'] = 'success';
                $this->flash['data'] = $productType;
            } else {
                $this->flash['msg'] = 'No se pudo crear el tipo de producto';
            }

            return session()->flash('flash', $this->flash);
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: '.$e->getMessage();

            return session()->flash('flash', $this->flash);
        }
    }

    public function update(Request $request, ProductType $productType)
    {
        try {
            $this->flash['action'] = 'updateProductType';
            $request->validate([
                'code' => 'required|max:6|unique:product_types,code,'.$productType->id,
                'name' => 'required|max:50|unique:product_types,name,'.$productType->id,
            ], [
                'code.required' => 'El código del tipo de producto es requerido',
                'code.max' => 'El codigo del tipo de producto debe tener como maximo 6 dígitos',
                'code.unique' => 'El código del tipo de producto debe ser único',
                'name.required' => 'El nombre es requerido',
                'name.max' => 'El nombre del tipo de producto debe tener como máximo 50 dígitos',
                'name.unique' => 'El nombre del tipo de producto debe ser único',
            ]);

            $updated = $productType->update([
                'code' => $request->input('code'),
                'name' => $request->input('name'),
            ]);

            if ($updated) {
                $this->flash['msg'] = 'El tipo de producto fue actualizado';
                $this->flash['type'] = 'success';
                $this->flash['data'] = $updated;
            } else {
                $this->flash['msg'] = 'No se pudo actualizar el tipo de producto';
            }

            return session()->flash('flash', $this->flash);
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: '.$e->getMessage();

            return session()->flash('flash', $this->flash);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductType $productType)
    {
        //
    }

    public function getAll(){
        $productsTypes = ProductType::select(['id','code','name'])->get();
        return response()->json($productsTypes);
    }
}
