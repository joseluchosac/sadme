import z from "zod";

export const labtestFormSchema = z.object({
  id: z.number().int(),
  code: z.string().min(1,{error: 'Ingrese el código'}).max(6,{error:'Máximo 6 caracteres'}),
  name: z.string().min(1,{error: 'Ingrese el nombre del exámen'}).max(255,{error:'Máximo 255 caracteres'}),
  area: z.string().min(1,{error: 'Ingrese el área'}).max(100,{error:'Máximo 100 caracteres'}),
  sample: z.string().min(1,{error: 'Ingrese la muestra'}).max(100,{error:'Máximo 100 caracteres'}),
  description: z.string().max(200,{error:'Máximo 200 caracteres'}),
  status: z.number().int().min(0).max(1),
});

export type LabtestFormT = z.infer<typeof labtestFormSchema>