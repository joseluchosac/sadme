<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductFormRequest;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    private $flash = ['msg' => '', 'type' => 'error', 'action' => '', 'data' => null];

    public function index(Request $request)
    {
        $products = Product::query()->with(['unit', 'category:id,name']);

        /* SEARCH */
        if ($request->filled('search')) {
            $products->where(function ($query) use ($request) {
                $query->where('code', 'like', '%'.$request->search.'%')
                    ->orWhere('name', 'like', '%'.$request->search.'%');
            });
        }

        /* EQUAL */
        if ($request->filled('category_id')) {
            $products->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $products->where('status', $request->status);
        }

        /* SORT */
        if ($request->filled('sortby')) {
            $sortby = explode('-', $request->sortby);
            $products->orderBy($sortby[0], $sortby[1] ?? 'asc');
        } else {
            $products->orderBy('name', 'asc');
        }

        $perPage = (int) ($request->per_page ?? 50);
        if ($perPage < 2 || $perPage > 500) {
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
                'category_id' => $product->category_id,
                'category_name' => $product->category->name ?? null,
                'description' => $product->description,
                'status' => $product->status,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ];
        });

        return Inertia::render('products/index', [
            'products' => $products,
            'qrystr' => $request->only(['search', 'category_id', 'status', 'sortby', 'page', 'per_page']),
        ]);
    }

    public function store(ProductFormRequest $request)
    {
        try {
            $this->flash['action'] = 'createProduct';

            $features = $request->input('features');
            $product = Product::create([
                'code' => $request->input('code'),
                'name' => $request->input('name'),
                'unit_code' => $request->input('unit_code'),
                'price' => $request->input('price'),
                'min_stock' => $request->input('min_stock'),
                'brand' => $request->input('brand'),
                'barcode' => $request->input('barcode'),
                'affectation_type_id' => $request->input('affectation_type_id'),
                'category_id' => $request->input('category_id'),
                'description' => $request->input('description'),
                'details' => $request->input('details'),
                'features' => is_array($features) ? $features : null,
                'observations' => $request->input('observations'),
                'notes' => $request->input('notes'),
                'show_price' => $request->input('show_price'),
                'status' => $request->input('status'),
            ]);

            if ($product) {
                // Datos complementarios de la relación uno a uno con p_labtests
                // if ($request->filled('labtest')) {
                //     $product->pLabtest()->create([
                //         'description' => $request->input('labtest.description'),
                //         'sirve' => $request->input('labtest.sirve'),
                //         'resultado' => $request->input('labtest.resultado'),
                //         'muestra' => $request->input('labtest.muestra'),
                //         'area' => $request->input('labtest.area'),
                //         'exams' => $request->input('labtest.exams'),
                //     ]);
                // }

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

            $features = $request->input('features');
            $product->update([
                'code' => $request->input('code'),
                'name' => $request->input('name'),
                'unit_code' => $request->input('unit_code'),
                'price' => $request->input('price'),
                'min_stock' => $request->input('min_stock'),
                'brand' => $request->input('brand'),
                'barcode' => $request->input('barcode'),
                'affectation_type_id' => $request->input('affectation_type_id'),
                'category_id' => $request->input('category_id'),
                'description' => $request->input('description'),
                'details' => $request->input('details'),
                'features' => is_array($features) ? $features : null,
                'observations' => $request->input('observations'),
                'notes' => $request->input('notes'),
                'show_price' => $request->input('show_price'),
                'status' => $request->input('status'),
            ]);

            // Datos complementarios de la relación uno a uno con p_labtests
            // (actualiza si existe o crea si aún no tiene registro)
            // if ($request->filled('labtest')) {
            //     $product->pLabtest()->updateOrCreate([], [
            //         'description' => $request->input('labtest.description'),
            //         'sirve' => $request->input('labtest.sirve'),
            //         'resultado' => $request->input('labtest.resultado'),
            //         'muestra' => $request->input('labtest.muestra'),
            //         'area' => $request->input('labtest.area'),
            //         'exams' => $request->input('labtest.exams'),
            //     ]);
            // }

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
        $product = $product->toArray();
        $product['details'] = $product['details'] ? str_replace(['&nbsp;', "\u{00A0}"], ' ', $product['details']) : $product['details'] ;
        return response()->json($product);
    }

    // Obtiene datos del producto para la vista publica
    public function getProductPublic(Product $product)
    {
        $product = $product->toArray();
        $product['details'] = $product['details'] ? str_replace(['&nbsp;', "\u{00A0}"], ' ', $product['details']) : $product['details'] ;
        return response()->json($product);
    }

    public function setStatus(Product $product)
    {
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

    public function productPdf(Product $product)
    {
        $product->load(['category', 'unit']);

        $detailsHtml = str_replace(['&nbsp;', "\u{00A0}"], ' ', $product->details);

        $pdf = Pdf::loadView('pdf.product-pdf', [
            'product' => $product,
            'detailsHtml' => $detailsHtml,
        ]);

        return $pdf->stream();
    }

    public function getPrices(Request $request)
    {
        $products = Product::select([
            'id',
            'code',
            'name',
            'price',
            'category_id',
            'description',
            'features',
            'unit_code',
            'status',
            'observations',
            'show_price',
            ])->with(['unit:id,code,name', 'category:id,name']);
        // $products = $products->get();
        // dd($products->toArray());
        /* SEARCH */
        if ($request->filled('search')) {
            $products->where(function ($query) use ($request) {
                $query->where('code', 'like', '%'.$request->search.'%')
                    ->orWhere('name', 'like', '%'.$request->search.'%');
            });
        }

        /* EQUAL */
        if ($request->filled('category_id')) {
            $products->where('category_id', $request->category_id);
        }

        /* SORT */
        if ($request->filled('sortby')) {
            $sortby = explode('-', $request->sortby);
            $products->orderBy($sortby[0], $sortby[1] ?? 'asc');
        } else {
            $products->orderBy('name', 'asc');
        }

        $perPage = (int) ($request->per_page ?? 50);
        if ($perPage < 2 || $perPage > 500) {
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
                'category_id' => $product->category_id,
                'category_name' => $product->category->name ?? null,
                'description' => $product->description,
                'features' => $product->features ?? null,
                'observations' => $product->observations ?? null,
                'status' => $product->status,
                'show_price' => $product->show_price,
            ];
        });

        return Inertia::render('pub/precios/index', [
            'products' => $products,
            'qrystr' => $request->only(['search', 'category_id', 'sortby', 'page', 'per_page']),
        ]);
    }
}
