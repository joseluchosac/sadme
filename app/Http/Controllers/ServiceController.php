<?php

namespace App\Http\Controllers;

use App\Models\ApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ServiceController extends Controller
{
    public function lookupIdentity(string $identity_code, string $identity_number)
    {
        $identity_names = ['06' => 'ruc', '01' => 'dni'];
        $api =ApiService::select(['service','provider','url', 'method', 'token', 'token_type'])
            ->where('service', $identity_names[$identity_code] ?? '')
            ->where('default', 1)
            ->first();
        switch ($api->provider) {
            case 'api.decolecta.com':
                return $this->servDecolecta($api->toArray(), $identity_number);
            // case 'app.factiliza.com':
            //     return $this->servFactiliza($api->toArray(), $identity_number);
            // case 'apiperu.dev':
            //     return $this->apiperu($api->toArray(), $identity_number);
            // case 'apis.aqpfact.pe':
            //     return $this->aqpfact($api->toArray(), $identity_number);
            // case 'miapi.cloud':
            //     return $this->miapiCloud($api->toArray(), $identity_number);
            default:
                return false;
        }
    }

    private function servDecolecta(array $api, string $identity_number)
    {
        $token = $api['token'];
        // $identity_number = $request->input('identity_number');
        // Hacer la petición al API
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->get($api['url'] . $identity_number);

        // Manejo de errores
        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'Error al consultar el RUC',
                'error' => $response->json(),
                'data' => null,
            ], $response->status());
        }
        $data = [];
        $data['identity_code'] = '06';
        $data['identity_name'] = 'RUC';
        $data['identity_number'] = $response['numero_documento'] ?? null;
        $data['name'] = $response['razon_social'] ?? null;
        $data['address'] = $response['direccion'] ?? null;
        $data['departamento'] = $response['departamento'] ?? null;
        $data['provincia'] = $response['provincia'] ?? null;
        $data['distrito'] = $response['distrito'] ?? null;
        $data['code_inei'] = $response['ubigeo'] ?? null;
        $data['estado'] = $response['estado'] ?? null;
        $data['condicion'] = $response['condicion'] ?? null;

        return response()->json([
            'success' => true,
            'message' => 'RUC consultado correctamente',
            'data' => $data,
        ]);
    }

    // private function servFactiliza(array $api, string $identity_number)
    // {
    //     $token = $api['token'];
    //     // Hacer la petición al API
    //     $response = Http::withHeaders([
    //         'Authorization' => "Bearer {$token}",
    //         'Accept' => 'application/json',
    //     ])->get($api['url'] . $identity_number);

    //     // Manejo de errores
    //     if ($response->failed()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error al consultar el DNI',
    //             'error' => $response->json(),
    //             'data' => null,
    //         ], $response->status());
    //     }

    //     $resp = $response['data'];
    //     $location_birth_id = null;
    //     $location_birth_name = null;
    //     $location_address_id = null;
    //     $location_address_name = null;

    //     if($resp['code_reniec'] ?? null){
    //         $locationAddress = Location::where('code_reniec', $resp['code_reniec'])->first()->toArray();
    //         $location_address_id = $locationAddress['id'];
    //         $location_address_name = concatenarArray([
    //             $locationAddress['distrito'], 
    //             $locationAddress['provincia'], 
    //             $locationAddress['departamento'],
    //             $locationAddress['distrito'] ? '' : $locationAddress['country'],
    //         ], ', ');
    //     }

    //     $data = [];
    //     $data['identity_number'] = $resp['numero'] ?? null;
    //     $data['last_name'] = $resp['apellido_paterno'] . ' ' . $resp['apellido_materno'];
    //     $data['first_name'] = $resp['nombres'] ?? null;
    //     $data['gender'] = $resp['sexo'] ?? null;
    //     $data['birth_date'] = $resp['fecha_nacimiento'] ?? null;
    //     $data['address'] = $resp['direccion'] ?? null;
    //     $data['location_birth_id'] = $location_birth_id ?? null;
    //     $data['location_birth_name'] = $location_birth_name ?? null;
    //     $data['location_address_id'] = $location_address_id ?? null;
    //     $data['location_address_name'] = $location_address_name ?? null;


    //     return response()->json([
    //         'success' => true,
    //         'message' => 'DNI consultado correctamente',
    //         'data' => $data,
    //     ]);
    // }

    // private function apiperu(array $api, string $identity_number)
    // {
    //     $token = $api['token'];
    //     // Hacer la petición al API
    //     $response = Http::withHeaders([
    //             'Accept' => 'application/json',
    //             'Content-Type' => 'application/json'
    //         ])
    //         ->withToken($token)
    //         ->asForm() // 👈 Esto indica que el body será enviado como form-data
    //         ->post($api['url'], [
    //             'dni' => $identity_number,
    //         ]);

    //     // Manejo de errores
    //     if ($response->failed()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error al consultar el DNI',
    //             'error' => $response->json(),
    //             'data' => null,
    //         ], $response->status());
    //     }

    //     $resp = $response['data'];

    //     $location_birth_id = null;
    //     $location_birth_name = null;
    //     $location_address_id = null;
    //     $location_address_name = null;

    //     if($resp['code_reniec'] ?? null){
    //         $locationAddress = Location::where('code_reniec', $resp['code_reniec'])->first()->toArray();
    //         $location_address_id = $locationAddress['id'];
    //         $location_address_name = concatenarArray([
    //             $locationAddress['distrito'], 
    //             $locationAddress['provincia'], 
    //             $locationAddress['departamento'],
    //             $locationAddress['distrito'] ? '' : $locationAddress['country'],
    //         ], ', ');
    //     }

    //     $data = [];
    //     $data['identity_number'] = $resp['numero'] ?? null;
    //     $data['last_name'] = $resp['apellido_paterno'] . ' ' . $resp['apellido_materno'];
    //     $data['first_name'] = $resp['nombres'] ?? null;
    //     $data['gender'] = $resp['sexo'] ?? null;
    //     $data['birth_date'] = $resp['fecha_nacimiento'] ?? null;
    //     $data['address'] = $resp['direccion'] ?? null;
    //     $data['location_birth_id'] = $location_birth_id ?? null;
    //     $data['location_birth_name'] = $location_birth_name ?? null;
    //     $data['location_address_id'] = $location_address_id ?? null;
    //     $data['location_address_name'] = $location_address_name ?? null;

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'DNI consultado correctamente',
    //         'data' => $data,
    //     ]);
    // }

    // private function aqpfact(array $api, string $identity_number)
    // {
    //     $token = $api['token'];
    //     // Hacer la petición al API
    //     $response = Http::withHeaders([
    //         'Authorization' => "Bearer {$token}",
    //         'Accept' => 'application/json',
    //     ])->get($api['url'] . $identity_number);

    //     // Manejo de errores
    //     if ($response->failed()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error al consultar el DNI',
    //             'error' => $response->json(),
    //             'data' => null,
    //         ], $response->status());
    //     }

    //     $resp = $response['data'];
    //     $location_birth_id = null;
    //     $location_birth_name = null;
    //     $location_address_id = null;
    //     $location_address_name = null;
    //     $fecha_nacimiento = null;

    //     if($resp['code_reniec'] ?? null){
    //         $locationAddress = Location::where('code_reniec', $resp['code_reniec'])->first()->toArray();
    //         $location_address_id = $locationAddress['id'];
    //         $location_address_name = concatenarArray([
    //             $locationAddress['distrito'], 
    //             $locationAddress['provincia'], 
    //             $locationAddress['departamento'],
    //             $locationAddress['distrito'] ? '' : $locationAddress['country'],
    //         ], ', ');
    //     }

    //     if($resp['fecha_nacimiento'] ?? null){
    //         $date = DateTime::createFromFormat('d/m/Y', $resp['fecha_nacimiento']);
    //         $fecha_nacimiento = $date->format('Y-m-d') ?? null;
    //     }

    //     $data = [];
    //     $data['identity_number'] = $resp['numero'] ?? null;
    //     $data['last_name'] = $resp['apellido_paterno'] . ' ' . $resp['apellido_materno'];
    //     $data['first_name'] = $resp['nombres'] ?? null;
    //     $data['gender'] = $resp['sexo'] ?? null;
    //     $data['birth_date'] = $fecha_nacimiento ?? null;
    //     $data['address'] = $resp['direccion'] ?? null;
    //     $data['location_birth_id'] = $location_birth_id ?? null;
    //     $data['location_birth_name'] = $location_birth_name ?? null;
    //     $data['location_address_id'] = $location_address_id ?? null;
    //     $data['location_address_name'] = $location_address_name ?? null;


    //     return response()->json([
    //         'success' => true,
    //         'message' => 'DNI consultado correctamente',
    //         'data' => $data,
    //     ]);
    // }

    // private function miapiCloud(array $api, string $identity_number)
    // {
    //     $token = $api['token'];
    //     // Hacer la petición al API
    //     $response = Http::withHeaders([
    //         'Authorization' => "Bearer {$token}",
    //         'Accept' => 'application/json',
    //     ])->get($api['url'] . $identity_number);

    //     // Manejo de errores
    //     if ($response->failed()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error al consultar el DNI',
    //             'error' => $response->json(),
    //             'data' => null,
    //         ], $response->status());
    //     }

    //     $resp = $response['datos'];
    //     $location_birth_id = null;
    //     $location_birth_name = null;
    //     $direccion = null;
    //     $location_address_id = null;
    //     $location_address_name = null;
    //     $fecha_nacimiento = null;

    //     if($resp['domiciliado'] ?? null){
    //         $direccion = $resp['domiciliado']['direccion'];
    //         $locationAddress = Location::where('code_inei', $resp['domiciliado']['ubigeo'])->first()->toArray();
    //         $location_address_id = $locationAddress['id'];
    //         $location_address_name = concatenarArray([
    //             $locationAddress['distrito'], 
    //             $locationAddress['provincia'], 
    //             $locationAddress['departamento'],
    //             $locationAddress['distrito'] ? '' : $locationAddress['country'],
    //         ], ', ');
    //     }

    //     if($resp['fecha_nacimiento'] ?? null){
    //         $date = DateTime::createFromFormat('d/m/Y', $resp['fecha_nacimiento']);
    //         $fecha_nacimiento = $date->format('Y-m-d') ?? null;
    //     }

    //     $data = [];
    //     $data['identity_number'] = $resp['dni'] ?? null;
    //     $data['last_name'] = $resp['ape_paterno'] . ' ' . $resp['ape_materno'];
    //     $data['first_name'] = $resp['nombres'] ?? null;
    //     $data['gender'] = $resp['sexo'] ?? null;
    //     $data['birth_date'] = $fecha_nacimiento ?? null;
    //     $data['address'] = $direccion ?? null;
    //     $data['location_birth_id'] = $location_birth_id ?? null;
    //     $data['location_birth_name'] = $location_birth_name ?? null;
    //     $data['location_address_id'] = $location_address_id ?? null;
    //     $data['location_address_name'] = $location_address_name ?? null;


    //     return response()->json([
    //         'success' => true,
    //         'message' => 'DNI consultado correctamente',
    //         'data' => $data,
    //     ]);
    // }
}
