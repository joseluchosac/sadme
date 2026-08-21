import z from "zod";

export const roleFormSchema = z.object({
  id: z.number().nullable(),
  name: z.string().min(3, 'Ingrese como mínimo 3 caracteres').max(255,'Máximo 255 caracteres'),
  permissions_ids: z.array(z.number())
});

export type RoleFormT = z.infer<typeof roleFormSchema>