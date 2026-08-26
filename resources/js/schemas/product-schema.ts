import z from "zod";
const feature = z.tuple([z.string(), z.string()]);
export const productFormSchema = z.object({
  id: z.number().int(),
  code: z.string().min(1,{error: 'Ingrese el código'}).max(6,{error:'Máximo 6 caracteres'}),
  name: z.string().min(1,{error: 'Ingrese el nombre del producto'}).max(255,{error:'Máximo 255 caracteres'}),
  unit_code: z.string().min(1,{error: 'Elija la unidad'}).max(3,{error:'Máximo 3 caracteres'}),
  price: z.number().nonnegative("Precio no válido"),
  min_stock: z.number().nonnegative("Stock min no válido"),
  brand: z.string().max(20,{error:'Máximo 20 caracteres'}).nullable(),
  barcode: z.string().max(20,{error:'El código de barras máximo 20 dígitos'}).nullable(),
  category_id: z.number().nullable(),
  affectation_type_id: z.number().min(1,'Elija la afectación'),
  description: z.string().max(255,{error:'Máximo 255 caracteres'}),
  details: z.string(),
  features: z.array(feature).nullable(),
  observations: z.string().max(255,{error:'Máximo 255 caracteres'}).nullable(),
  notes: z.string().max(255,{error:'Máximo 255 caracteres'}).nullable(),
  show_price: z.number().int().min(0).max(1),
  status: z.number().int().min(0).max(1),
});

export type ProductFormT = z.infer<typeof productFormSchema>