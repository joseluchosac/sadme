<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    private $flash = ["msg" => '', "type" => "error", "action" => "", "data" => null];
    private $response = ["success" => true, "msg" => ""];

    public function index(Request $request)
    {
        $roles = Role::query()->with('permissions');
        /* SEARCH */
        if ($request->filled('search')) {
            $roles->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('guard_name', 'like', '%' . $request->search . '%');
            });
        }

        /* SORT */
        if ($request->filled('sortby')) {
            $sortby = explode('-', $request->sortby);
            $roles->orderBy($sortby[0], $sortby[1] ?? 'asc');
        } else {
            $roles->orderBy('id', 'desc');
        }

        $perPage = (int) ($request->per_page ?? 50);
        if ($perPage < 2 || $perPage > 200) {
            $perPage = 10;
        }

        $roles = $roles->paginate($perPage)->onEachSide(1)->withQueryString();
        $roles->getCollection()->transform(fn($roles) => [
            'id' => $roles->id,
            'name' => $roles->name,
            'guard_name' => $roles->guard_name,
            'permissions' => $roles->permissions,
            'created_at' => $roles->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $roles->updated_at?->format('Y-m-d H:i:s'),
        ]);
        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'qrystr' => $request->only(['search', 'sortby', 'page', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'permissionsIds' => 'array',
            'permissionsIds.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
        ]);

        if ($role && $request->has('permissions_ids')) {
            $role->syncPermissions($request->permissions_ids);
        }

        session()->flash('flash', [
            "msg" => "Rol creado con éxito",
            "type" => "success",
            "action" => "storeRole",
            "data" => null
        ]);
        return redirect()->route('admin.roles.index');
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions_ids' => 'array',
            'permissions_ids.*' => 'exists:permissions,id',
        ]);

        $role->update($validated);

        if ($request->has('permissions_ids')) {
            $role->syncPermissions($request->permissions_ids);
        }

        session()->flash('flash', [
            "msg" => "Rol actualizado con éxito",
            "type" => "success",
            "action" => "updateRole",
            "data" => null
        ]);
        return redirect()->route('admin.roles.index');
    }

    public function destroy(Role $role)
    {
        $role->delete();
        session()->flash('flash', [
            "msg" => "Rol eliminado con éxito",
            "type" => "success",
            "action" => "destroyRole",
            "data" => null
        ]);
        return redirect()->route('admin.roles.index');
    }

    public function getRole(Role $role)
    {
        $permissions_ids = $role->permissions->pluck('id'); // obtiene los id de los permisos asociados al rol
        // $role->load(['permissions']);
        $data = $role->makeHidden(['permissions'])->toArray();
        $data['created_at'] = $role->created_at->format('Y-m-d H:i:s');
        $data['updated_at'] = $role->updated_at->format('Y-m-d H:i:s');
        $data['permissions_ids'] = $permissions_ids;
        $this->response['role'] = $data;
        return response()->json($this->response);
    }

    public function getAllRoles() 
    {
        $roles = Role::All();
        return response()->json($roles);
    }

    public function search(Request $request)
    {
        // $search = $request->input('query');

        // $suppliers = Supplier::query()->with(['identity:code,name']);

        // if ($search) {
        //     $suppliers->where(
        //         fn($query) => $query->where('name', 'like', "%{$search}%")
        //             ->orWhere('identity_number', 'like', "%{$search}%")
        //     );
        // }

        // $suppliers->orderBy('name')->limit(30);
        // $suppliers = $suppliers->get();

        // $suppliers->transform(function ($supplier) {
        //     return [
        //         'id' => $supplier->id,
        //         'name' => $supplier->name,
        //         'identity_number' => $supplier->identity_number,
        //         'identity_name' => $supplier->identity->name,
        //     ];
        // });
        // return response()->json($suppliers);
    }
}
