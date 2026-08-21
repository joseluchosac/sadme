<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    private $flash = ["msg" => '', "type" => "error", "action" => "", "data" => null];
    private $response = ["success" => true, "msg" => ""];

    public function index(Request $request)
    {
        $permissions = Permission::query()->with('roles');

        /* SEARCH */
        if ($request->filled('search')) {
            $permissions->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('guard_name', 'like', '%' . $request->search . '%');
            });
        }

        /* SORT */
        if ($request->filled('sortby')) {
            $sortby = explode('-', $request->sortby);
            $permissions->orderBy($sortby[0], $sortby[1] ?? 'asc');
        } else {
            $permissions->orderBy('id', 'desc');
        }

        $perPage = (int) ($request->per_page ?? 50);
        if ($perPage < 2 || $perPage > 200) {
            $perPage = 10;
        }

        $permissions = $permissions->paginate($perPage)->onEachSide(1)->withQueryString();
        $permissions->getCollection()->transform(fn($permissions) => [
            'id' => $permissions->id,
            'name' => $permissions->name,
            'guard_name' => $permissions->guard_name,
            'roles' => $permissions->roles,
            'created_at' => $permissions->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $permissions->updated_at?->format('Y-m-d H:i:s'),
        ]);
        return Inertia::render('admin/permissions/index', [
            'permissions' => $permissions,
            'qrystr' => $request->only(['search', 'sortby', 'page', 'per_page']),
        ]);
    }

    // public function create()
    // {
    //     $permissions = Permission::all();
    //     return Inertia::render('admin/permissions/permission-form', compact('permissions'));
    // }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions',
            'rolesIds' => 'array',
            'rolesIds.*' => 'exists:roles,id',
        ]);

        $permission = Permission::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name,
        ]);
        if ($request->has('rolesIds')) {
            $permission->syncRoles($request->rolesIds);
        }

        session()->flash('flash', [
            "msg" => "Rol creado con éxito",
            "type" => "success",
            "action" => "storePermission",
            "data" => null
        ]);
        return redirect()->route('admin.permissions.index');
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'rolesIds' => 'array',
            'rolesIds.*' => 'exists:roles,id',
        ]);

        $permission->update($validated);

        if ($request->has('rolesIds')) {
            $permission->syncRoles($request->rolesIds);
        }

        session()->flash('flash', [
            "msg" => "Rol actualizado con éxito",
            "type" => "success",
            "action" => "updatePermission",
            "data" => null
        ]);
        return redirect()->route('admin.permissions.index');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();
        session()->flash('flash', [
            "msg" => "Permiso eliminado con éxito",
            "type" => "success",
            "action" => "destroyPermission",
            "data" => null
        ]);
        return redirect()->route('admin.permissions.index');
    }

    public function getPermission(string $permission_id)
    {
        $permission = Permission::find($permission_id);
        $data = $permission->toArray();

        $data['created_at'] = $permission->created_at->format('Y-m-d H:i:s');
        $data['updated_at'] = $permission->updated_at->format('Y-m-d H:i:s');
        $this->response['permission'] = $data;
        return response()->json($this->response);
    }

    public function getAllPermissions()
    {
        $permissions = Permission::all();
        return response()->json($permissions);
    }
}
