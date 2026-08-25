<?php

use App\Models\Category;
use App\Models\PLabtest;
use App\Models\Product;
use App\Models\User;

function productPayload(array $overrides = []): array
{
    $category = Category::firstOrCreate(['code' => 'EXA'], ['name' => 'Examen', 'status' => 1]);

    return array_merge([
        'code' => 'LAB-001',
        'name' => 'Hemograma completo',
        'unit_code' => 'NIU',
        'price' => 25.5,
        'min_stock' => 10,
        'category_id' => $category->id,
        'affectation_type_id' => 1,
    ], $overrides);
}

function labtestPayload(array $overrides = []): array
{
    return array_merge([
        'description' => 'Examen de sangre completa',
        'sirve' => 'Diagnóstico general',
        'resultado' => 'Cuantitativo',
        'muestra' => 'Sangre venosa',
        'area' => 'Hematología',
        'exams' => 'HB, GB, GR',
    ], $overrides);
}

test('store crea el producto y su registro de p_labtests relacionado', function () {
    $this->actingAs(User::factory()->create());

    $payload = array_merge(productPayload(), ['labtest' => labtestPayload()]);

    $response = $this->post(route('products.store'), $payload);

    $response->assertSuccessful();

    $product = Product::where('code', 'LAB-001')->first();

    expect($product)->not->toBeNull();

    $this->assertDatabaseHas('p_labtests', [
        'product_id' => $product->id,
        'description' => 'Examen de sangre completa',
        'sirve' => 'Diagnóstico general',
        'resultado' => 'Cuantitativo',
        'muestra' => 'Sangre venosa',
        'area' => 'Hematología',
        'exams' => 'HB, GB, GR',
    ]);
});

test('store no crea registro de p_labtests cuando no se envían datos complementarios', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('products.store'), productPayload());

    expect(PLabtest::count())->toBe(0);
});

test('update actualiza el registro de p_labtests existente sin duplicarlo', function () {
    $this->actingAs(User::factory()->create());

    $payload = array_merge(productPayload(), ['labtest' => labtestPayload()]);
    $this->post(route('products.store'), $payload);

    $product = Product::where('code', 'LAB-001')->first();
    expect($product->pLabtest)->not->toBeNull();

    $updatePayload = array_merge(productPayload(['name' => 'Hemograma modificado']), [
        'labtest' => labtestPayload(['area' => 'Bioquímica']),
    ]);
    $this->put(route('products.update', $product), $updatePayload);

    expect(PLabtest::where('product_id', $product->id)->count())->toBe(1);

    $this->assertDatabaseHas('p_labtests', [
        'product_id' => $product->id,
        'area' => 'Bioquímica',
    ]);
});

test('update crea el registro de p_labtests cuando el producto aún no lo tiene', function () {
    $this->actingAs(User::factory()->create());

    $this->post(route('products.store'), productPayload());

    $product = Product::where('code', 'LAB-001')->first();
    expect($product->pLabtest)->toBeNull();

    $updatePayload = array_merge(productPayload(), ['labtest' => labtestPayload()]);
    $this->put(route('products.update', $product), $updatePayload);

    $this->assertDatabaseHas('p_labtests', [
        'product_id' => $product->id,
        'resultado' => 'Cuantitativo',
        'muestra' => 'Sangre venosa',
        'area' => 'Hematología',
    ]);
});

test('valida que resultado, muestra y area sean obligatorios al enviar datos de labtest', function (string $field) {
    $this->actingAs(User::factory()->create());

    $payload = array_merge(productPayload(), [
        'labtest' => labtestPayload([$field => null]),
    ]);

    $response = $this->from('/dashboard')->post(route('products.store'), $payload);

    $response->assertSessionHasErrors($field === '' ? [] : ["labtest.$field"]);
})->with([
    'resultado',
    'muestra',
    'area',
]);
