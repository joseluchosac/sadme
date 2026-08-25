<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    private $flash = ['msg' => '', 'type' => 'error', 'action' => '', 'data' => null];

    public function index(Request $request)
    {
        $categories = Category::query();

        /* SEARCH */
        if ($request->filled('search')) {
            $categories->where(function ($query) use ($request) {
                $query->where('name', 'like', '%'.$request->search.'%');
            });
        }

        /* SORT */
        if ($request->filled('sortby')) {
            $sortby = explode('-', $request->sortby);
            $categories->orderBy($sortby[0], $sortby[1] ?? 'asc');
        } else {
            $categories->orderBy('name', 'asc');
        }

        $perPage = (int) ($request->per_page ?? 50);
        if ($perPage < 2 || $perPage > 200) {
            $perPage = 10;
        }

        $categories = $categories->paginate($perPage)->onEachSide(1)->withQueryString();

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'qrystr' => $request->only(['search', 'sortby', 'page', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $this->flash['action'] = 'createCategory';
            $request->validate([
                'name' => 'required|max:50|unique:categories,name',
            ], [
                'name.required' => 'El nombre es requerido',
                'name.max' => 'El nombre de la categoría debe tener como máximo 50 dígitos',
                'name.unique' => 'El nombre de la categoría debe ser único',
            ]);

            $category = Category::create([
                'name' => $request->input('name'),
            ]);

            if ($category) {
                $this->flash['msg'] = 'La categoría fue creada';
                $this->flash['type'] = 'success';
                $this->flash['data'] = $category;
            } else {
                $this->flash['msg'] = 'No se pudo crear el tipo de producto';
            }

            return session()->flash('flash', $this->flash);
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: '.$e->getMessage();

            return session()->flash('flash', $this->flash);
        }
    }

    public function update(Request $request, Category $category)
    {
        try {
            $this->flash['action'] = 'updateCategory';
            $request->validate([
                'name' => 'required|max:50|unique:categories,name,'.$category->id,
            ], [
                'name.required' => 'El nombre es requerido',
                'name.max' => 'El nombre de la categoría debe tener como máximo 50 dígitos',
                'name.unique' => 'El nombre de la categoría debe ser único',
            ]);

            $updated = $category->update([
                'name' => $request->input('name'),
            ]);

            if ($updated) {
                $this->flash['msg'] = 'La categoría fue actualizada';
                $this->flash['type'] = 'success';
                $this->flash['data'] = $updated;
            } else {
                $this->flash['msg'] = 'No se pudo actualizar la categoría';
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
    public function destroy(Category $category)
    {
        //
    }

    public function getAll()
    {
        $data = Category::select(['id', 'name'])->get();

        return response()->json($data);
    }
}
