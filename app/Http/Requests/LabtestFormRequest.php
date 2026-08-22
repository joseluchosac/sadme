<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LabtestFormRequest extends FormRequest
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
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'status' => 'nullable|boolean',
        ];

        if ($this->isMethod('post')) {
            // Reglas específicas para store
            $rules['code'] = $rules['code'] . '|unique:labtests,code';
            $rules['name'] = $rules['name'] . '|unique:labtests,name';
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            // Reglas específicas para update
            $rules['code'] = $rules['code'] . '|unique:labtests,code,' . $this->route('labtest')->id;
            $rules['name'] = $rules['name'] . '|unique:labtests,name,' . $this->route('labtest')->id;
        }
        return $rules;
    }

    public function messages()
    {
        // return parent::messages();
        $messages = [
            'code.required' => 'El código es obligatorio.',
            'code.string' => 'El código debe ser una cadena de texto.',
            'code.max' => 'El código no debe exceder los 50 caracteres.',
            'code.unique' => 'El código ya existe, ingrese otro.',

            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe exceder los 100 caracteres.',
            'name.unique' => 'El nombre del examen ya existe, ingrese otro.',

            'description.string' => 'La descripción debe ser una cadena de texto.',
            'description.max' => 'La descripción no debe exceder los 255 caracteres.',

            'price.numeric' => 'El precio debe ser un número.',
            'price.min' => 'El precio no puede ser negativo.',

            'status.boolean' => 'El estado debe ser verdadero o falso.',
        ];

        return $messages;
    }
}
