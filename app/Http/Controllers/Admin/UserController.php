<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    private $flash = ["msg" => '', "type" => "error", "action" => "", "data" => null];
    private $response = ["success" => true, "msg" => ""];

    public function index(Request $request)
    {
        $users = User::query()->with(['roles:id,name']);

        /* SEARCH */
        if ($request->filled('search')) {
            $users->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('username', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        /* SORT */
        if ($request->filled('sortby')) {
            $sortby = explode('-', $request->sortby);
            $users->orderBy($sortby[0], $sortby[1] ?? 'asc');
        } else {
            $users->orderBy('id', 'desc');
        }

        $perPage = (int) ($request->per_page ?? 50);
        if ($perPage < 2 || $perPage > 200) {
            $perPage = 10;
        }

        $users = $users->paginate($perPage)->onEachSide(1)->withQueryString();
        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'roles' => $user->roles,
                'email' => $user->email,
                'email_verifed_at' => $user->email_verifed_at,
                'created_at' => $user->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $user->updated_at?->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'qrystr' => $request->only(['search', 'sortby', 'page', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $this->flash['action'] = "createUser";
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'nullable|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        if ($user && $request->has('roles_ids')) {
            $user->syncRoles($request->roles_ids);
        }
        if ($user) {
            $this->flash['msg'] = 'Usuario creado satisfactoriamente';
            $this->flash['type'] = 'success';
            $this->flash['data'] = $user;
        } else {
            $this->flash['msg'] = 'No se pudo crear el usuario';
        }

        return session()->flash('flash', $this->flash);
    }
    public function update(Request $request, User $user)
    {
        $this->flash['action'] = "updateUser";
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // 'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'nullable|string|lowercase|email|max:255|unique:users,email,' . $user->id,
        ]);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();
        if ($request->has('roles_ids')) {
            $user->syncRoles($request->roles_ids);
        }
        if ($user) {
            $this->flash['msg'] = 'Usuario actualizado correctamente';
            $this->flash['type'] = 'success';
            $this->flash['data'] = $user;
        } else {
            $this->flash['msg'] = 'No se pudo actualizar el usuario';
        }
        return session()->flash('flash', $this->flash);
    }

    public function destroy(User $user)
    {
        try {
            //VALIDAR QUE EL USUARIO NO ESTE RELACIONADO A OTRAS TABLAS
            if ($user->id === 1) {
                throw new \Exception("No se puede eliminar al usuario");
            }
            $this->flash['action'] = "destroyUser";
            $user->delete();
            if ($user) {
                $this->flash['msg'] = 'Usuario eliminado permanentemente';
                $this->flash['type'] = 'success';
                $this->flash['data'] = $user;
            } else {
                $this->flash['msg'] = 'No se pudo eliminar el usuario';
            }
        } catch (Exception $e) {
            $this->flash['msg'] = 'Error: ' . $e->getMessage();
        }
        return session()->flash('flash', $this->flash);
    }

    public function getUser(User $user)
    {
        $roles_ids = $user->roles->pluck('id'); // obtiene los id de los roles asociados al usuario
        $data = $user->makeHidden(['roles'])->toArray();
        $data['created_at'] = $user->created_at->format('Y-m-d H:i:s');
        $data['updated_at'] = $user->updated_at->format('Y-m-d H:i:s');
        $data['roles_ids'] =  $roles_ids;

        $this->response['user'] = $data;
        return response()->json($this->response);
    }
}
