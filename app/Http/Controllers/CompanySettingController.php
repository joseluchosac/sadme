<?php

namespace App\Http\Controllers;

use App\Models\CompanySetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanySettingController extends Controller
{
    private $flash = ["msg" => '', "type" => "error", "action" => "", "data" => null];

    public function index()
    {
        $companySettings = CompanySetting::all();
        return Inertia::render('settings/company-settings', compact('companySettings'));
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
    }

    /**
     * Display the specified resource.
     */
    public function show(CompanySetting $companySetting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CompanySetting $companySetting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        foreach ($request->items as $value) {
            $item = CompanySetting::find($value['id']);
            $item->valor = $value['valor'] ?? '';
            $item->save();
        }
        $this->flash['msg'] = 'Los datos fueron actualizados correctamente';
        $this->flash['type'] = 'success';
        return session()->flash('flash', $this->flash);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CompanySetting $companySetting)
    {
        //
    }
}
