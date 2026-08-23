<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductFormRequest;
use App\Models\Product;
use App\Models\ProductType;
use App\Models\Unit;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    private $flash = ['msg' => '', 'type' => 'error', 'action' => '', 'data' => null];

    public function index(Request $request)
    {
        $products = Product::query()->with(['productType:id,code,name', 'unit']);
        $productTypes = ProductType::select(['id','code','name'])->get();
        $units = Unit::select(['id','code','abb','name','status'])->get();

        /* SEARCH */
        if ($request->filled('search')) {
            $products->where(function ($query) use ($request) {
                $query->where('code', 'like', '%'.$request->search.'%')
                    ->orWhere('name', 'like', '%'.$request->search.'%');
            });
        }

        /* SORT */
        if ($request->filled('sortby')) {
            $sortby = explode('-', $request->sortby);
            $products->orderBy($sortby[0], $sortby[1] ?? 'asc');
        } else {
            $products->orderBy('name', 'asc');
        }

        $perPage = (int) ($request->per_page ?? 50);
        if ($perPage < 2 || $perPage > 200) {
            $perPage = 10;
        }

        $products = $products->paginate($perPage)->onEachSide(1)->withQueryString();
        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'code' => $product->code,
                'name' => $product->name,
                'unit_code' => $product->unit_code,
                'unit_name' => $product->unit->name,
                'price' => $product->price,
                'min_stock' => $product->min_stock,
                'brand' => $product->brand,
                'product_type_id' => $product->product_type_id,
                'product_type_name' => $product->productType->name,
                'description' => $product->description,
                'status' => $product->status,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ];
        });
        return Inertia::render('products/index', [
            'products' => $products,
            'productTypes' => $productTypes,
            'units' => $units,
            'qrystr' => $request->only(['search', 'sortby', 'page', 'per_page']),
        ]);
    }

    public function store(ProductFormRequest $request)
    {
        try {
            $this->flash['action'] = 'createProduct';

            $product = Product::create([
                'code' => $request->input('code'),
                'name' => $request->input('name'),
                'unit_code' => $request->input('unit_code'),
                'price' => $request->input('price'),
                'min_stock' => $request->input('min_stock'),
                'brand' => $request->input('brand'),
                'bar_code' => $request->input('bar_code'),
                'product_type_id' => $request->input('product_type_id'),
                'affectation_type_id' => $request->input('affectation_type_id'),
                'description' => $request->input('description'),
            ]);

            if ($product) {
                $this->flash['msg'] = 'El producto fue creado satisfactoriamente';
                $this->flash['type'] = 'success';
                $this->flash['data'] = $product;
            } else {
                $this->flash['msg'] = 'No se pudo crear el producto';
            }

            return session()->flash('flash', $this->flash);
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: '.$e->getMessage();

            return session()->flash('flash', $this->flash);
        }
    }

    public function update(ProductFormRequest $request, Product $product)
    {
        try {
            $this->flash['action'] = 'updateProduct';

            $product->update([
                'code' => $request->input('code'),
                'name' => $request->input('name'),
                'unit_code' => $request->input('unit_code'),
                'price' => $request->input('price'),
                'min_stock' => $request->input('min_stock'),
                'brand' => $request->input('brand'),
                'bar_code' => $request->input('bar_code'),
                'product_type_id' => $request->input('product_type_id'),
                'affectation_type_id' => $request->input('affectation_type_id'),
                'description' => $request->input('description'),
            ]);

            if ($product) {
                $this->flash['msg'] = 'El producto fue actualizado satisfactoriamente';
                $this->flash['type'] = 'success';
                $this->flash['data'] = $product;
            } else {
                $this->flash['msg'] = 'No se pudo actualizar el producto';
            }

            return session()->flash('flash', $this->flash);
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: '.$e->getMessage();

            return session()->flash('flash', $this->flash);
        }
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();
            $this->flash['msg'] = 'El examen fue eliminado satisfactoriamente';
            $this->flash['type'] = 'success';
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: '.$e->getMessage();
        }

        return session()->flash('flash', $this->flash);
    }

    public function getProduct(Product $product)
    {
        return response()->json($product);
    }

    public function setStatus(Product $product)
    {
        // dd($product->toArray());
        try {
            $product->status = $product->status ? 0 : 1;
            $product->save();

            $this->flash['msg'] = 'El estado del examen fue actualizado satisfactoriamente';
            $this->flash['type'] = 'success';
            $this->flash['data'] = $product;
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: '.$e->getMessage();
        }

        return session()->flash('flash', $this->flash);
    }
}
