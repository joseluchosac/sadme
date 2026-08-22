<?php

namespace App\Http\Controllers;

use App\Http\Requests\LabtestFormRequest;
use App\Models\Labtest;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LabtestController extends Controller
{
    private $flash = ["msg" => '', "type" => "error", "action" => "", "data" => null];

    public function index(Request $request)
    {
        $labtests = Labtest::query();

        /* SEARCH */
        if ($request->filled('search')) {
            $labtests->where(function ($query) use ($request) {
                $query->where('code', 'like', '%'.$request->search.'%')
                    ->orWhere('name', 'like', '%'.$request->search.'%');
            });
        }

        /* SORT */
        if ($request->filled('sortby')) {
            $sortby = explode('-', $request->sortby);
            $labtests->orderBy($sortby[0], $sortby[1] ?? 'asc');
        } else {
            $labtests->orderBy('name', 'asc');
        }

        $perPage = (int) ($request->per_page ?? 50);
        if ($perPage < 2 || $perPage > 200) {
            $perPage = 10;
        }

        $labtests = $labtests->paginate($perPage)->onEachSide(1)->withQueryString();

        return Inertia::render('labtests/index', [
            'labtests' => $labtests,
            'qrystr' => $request->only(['search', 'sortby', 'page', 'per_page']),
        ]);
    }

    public function store(LabtestFormRequest $request)
    {
        // dd($request->all());
        try {
            $this->flash['action'] = "createLabtest";

            $labtest = Labtest::create([
                'code' => $request->input('code'),
                'name' => $request->input('name'),
                'area' => $request->input('area'),
                'sample' => $request->input('sample'),
                'description' => $request->input('description'),
            ]);

            if ($labtest) {
                $this->flash['msg'] = 'El examen fue creado satisfactoriamente';
                $this->flash['type'] = 'success';
                $this->flash['data'] = $labtest;
            } else {
                $this->flash['msg'] = 'No se pudo crear el examen';
            }

            return session()->flash('flash', $this->flash);
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: ' . $e->getMessage();
            return session()->flash('flash', $this->flash);
        }
    }

    public function update(LabtestFormRequest $request, Labtest $labtest)
    {
        try {
            $this->flash['action'] = "updateLabtest";

            $labtest->update([
                'code' => $request->input('code'),
                'name' => $request->input('name'),
                'area' => $request->input('area'),
                'sample' => $request->input('sample'),
                'description' => $request->input('description'),
            ]);

            if ($labtest) {
                $this->flash['msg'] = 'El examen fue actualizado satisfactoriamente';
                $this->flash['type'] = 'success';
                $this->flash['data'] = $labtest;
            } else {
                $this->flash['msg'] = 'No se pudo actualizar el examen';
            }

            return session()->flash('flash', $this->flash);
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: ' . $e->getMessage();
            return session()->flash('flash', $this->flash);
        }
    }
    
    public function destroy(Labtest $labtest)
    {
        try {
            $labtest->delete();
            $this->flash['msg'] = 'El examen fue eliminado satisfactoriamente';
            $this->flash['type'] = 'success';
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: ' . $e->getMessage();
        }
        return session()->flash('flash', $this->flash);
    }

    public function getLabtest(Labtest $labtest)
    {
        return response()->json($labtest);
    }

    public function setStatus(Labtest $labtest)
    {
        try {
            $labtest->status = $labtest->status ? 0 : 1;
            $labtest->save();

            $this->flash['msg'] = 'El estado del examen fue actualizado satisfactoriamente';
            $this->flash['type'] = 'success';
            $this->flash['data'] = $labtest;
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: ' . $e->getMessage();
        }
        return session()->flash('flash', $this->flash);
    }
}
