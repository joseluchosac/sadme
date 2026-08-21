import z from "zod";

export const userFormSchema = z.object({
  id: z.number().nullable(),
  name: z.string().min(3, 'Ingrese como mínimo 3 caracteres').max(255,'Máximo 255 caracteres'),
  username: z.string().min(3, 'Ingrese como mínimo 3 caracteres').max(255,'Máximo 255 caracteres'),
  email: z.email('Formato de email no válido'),
  password: z.string(),
  password_confirmation: z.string(),
  roles_ids: z.array(z.number())
}).superRefine((data, ctx) => {
  if (!data.id && !data.password) {
    ctx.addIssue({
      code: "custom",
      message: "La contraseña es requerida",
      path: ["password"]
    });
  }
  if ((data.password || data.password_confirmation) && data.password !== data.password_confirmation) {
    ctx.addIssue({
      code: 'custom',
      message: "Las contraseñas no coinciden",
      path: ["password_confirmation"]
    });
  }
});

export type UserFormT = z.infer<typeof userFormSchema>