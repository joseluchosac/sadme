import z from "zod";

export const permissionFormSchema = z.object({
  id: z.number().nullable(),
  name: z.string().min(3, 'Ingrese como mínimo 3 caracteres').max(255,'Máximo 255 caracteres'),
});

export type PermissionFormT = z.infer<typeof permissionFormSchema>