<?php

namespace App\Http\Middleware;

use App\Models\CompanySetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        $company['nombre_comercial'] = CompanySetting::select('valor')->where('campo', 'nombre_comercial')->first()?->valor ?? 'EMPRESA';
        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'username' => $request->user()->username,
                    'email' => $request->user()->email,
                    'email_verified_at' => $request->user()->emailVerified,
                    'created_at' => $request->user()->created_at,
                    'updated_at' => $request->user()->updated_at,
                    'can' => $request->user()
                        ? $request->user()->getPermissionsViaRoles()->pluck('name')->mapWithKeys(fn($permission) => [$permission => true])->all()
                        : [],
                ] : null,
                'company' => $company,
            ],
            'flash' => $request->session()->get('flash'),
        ]);
    }
}
