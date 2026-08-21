<?php

namespace App\Http\Controllers;

use App\Models\Ubigeo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UbigeoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Ubigeo $ubigeo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ubigeo $ubigeo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ubigeo $ubigeo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ubigeo $ubigeo)
    {
        //
    }

    public function getDepartamentos()
    {
        $departamentos = DB::table('ubigeos')
            ->selectRaw('DISTINCT LEFT(code_inei,2) AS depa_cod, departamento')
            ->orderBy('departamento', 'asc')
            ->get();
        return response()->json($departamentos);
    }

    public function getProvincias(string $depa_cod)
    {
        $provincias = DB::table('ubigeos')
            ->selectRaw('DISTINCT LEFT(code_inei, 4) AS prov_cod, provincia')
            ->where('code_inei', 'like', "$depa_cod%")
            ->whereNotNull('provincia')
            ->orderBy('provincia', 'asc')
            ->get();
        return response()->json($provincias);
    }

    public function getDistritos(string $prov_cod)
    {
        $distritos = DB::table('ubigeos')
            ->selectRaw('id, code_inei, code_reniec, departamento, provincia, distrito')
            ->where('code_inei', 'like', "$prov_cod%")
            ->whereNotNull('distrito')
            ->orderBy('distrito', 'asc')
            ->get();
        $distritos->transform(function ($distrito) {
            $ubigeo_ipd = $distrito->distrito . ' - ' . $distrito->provincia . ' - ' . $distrito->departamento;
            return [
                'id' => $distrito->id,
                'code_inei' => $distrito->code_inei,
                'departamento' => $distrito->departamento,
                'provincia' => $distrito->provincia,
                'distrito' => $distrito->distrito,
                'ubigeo_ipd' => $ubigeo_ipd,
            ];
        });
        return response()->json($distritos);
    }
}
