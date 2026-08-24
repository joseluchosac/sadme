<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProductFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'code' => 'required|max:50',
            'name' => 'required|max:255',
            'unit_code' => 'required|max:3',
            'price' => 'required|numeric|min:0',
            'min_stock' => 'required|integer|min:0',
            'brand' => 'nullable|string|max:100',
            'barcode' => 'nullable|max:20',
            'product_type_id' => 'integer|min:1',
            'affectation_type_id' => 'integer|min:1',
            'description' => 'nullable|max:300',
            'status' => 'nullable|boolean',
            // 'labtest' => 'nullable|array',
            // 'labtest.description' => 'nullable|string|max:1000',
            // 'labtest.sirve' => 'nullable|string',
            // 'labtest.resultado' => 'required_with:labtest|string|max:255',
            // 'labtest.muestra' => 'required_with:labtest|string|max:255',
            // 'labtest.area' => 'required_with:labtest|string|max:255',
            // 'labtest.exams' => 'nullable|string',
        ];

        if ($this->isMethod('post')) {
            // Reglas específicas para store
            $rules['code'] = $rules['code'].'|unique:products,code';
            $rules['name'] = $rules['name'].'|unique:products,name';
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            // Reglas específicas para update
            $rules['code'] = $rules['code'].'|unique:products,code,'.$this->route('product')->id;
            $rules['name'] = $rules['name'].'|unique:products,name,'.$this->route('product')->id;
        }

        return $rules;
    }

    public function messages()
    {
        // return parent::messages();
        $messages = [
            'code.required' => 'Ingrese el código.',
            'code.max' => 'El código no debe exceder los 50 caracteres.',
            'code.unique' => 'El código ya existe, ingrese otro.',

            'name.required' => 'El nombre es obligatorio.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'name.unique' => 'El nombre del producto ya existe, ingrese otro.',

            'unit_code.required' => 'Elija la unidad.',
            'unit_code.max' => 'La unidad no debe exeder los 3 caracteres.',

            'product_type_id.min' => 'Elija el tipo.',
            'affectation_type_id.min' => 'Elija la afectación.',

            'description.max' => 'La descripción no debe exceder los 300 caracteres.',

            'price.numeric' => 'El precio debe ser un número.',
            'price.min' => 'El precio no puede ser negativo.',

            'status.boolean' => 'El estado debe ser verdadero o falso.',

            // 'labtest.resultado.required_with' => 'Ingrese el resultado.',
            // 'labtest.muestra.required_with' => 'Ingrese la muestra.',
            // 'labtest.area.required_with' => 'Ingrese el área.',
        ];

        return $messages;
    }
}
