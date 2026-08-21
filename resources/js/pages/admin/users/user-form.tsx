import { useAlertDialog } from '@/components/alert_dialog/use-alert-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import useRoleService from '@/hooks/use-role-service';
import useUserService from '@/hooks/use-user-service';
import { userFormSchema, UserFormT } from '@/schemas/user-schema';
import { Flash, Role, UserData } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';

const formInit: UserFormT = {
  id: null,
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  roles_ids: []
};

type UserFormProps = {
  userId: number | null;
  onClose: () => void;
}

export default function UserForm({ userId, onClose }: UserFormProps) {
  const form = useForm(formInit);
  const { getUser, data: userData, isLoading: userIsLoading } = useUserService<UserData>()
  const { getAllRoles, data: rolesData, isLoading: rolesIsLoading } = useRoleService<Role[]>();
  const { confirm } = useAlertDialog()

  const handleClose = async () => {
    onClose();
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.clearErrors();
    const result = userFormSchema.safeParse(form.data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        form.setError(issue.path[0] as keyof UserFormT, issue.message);
      });
      return;
    }
    const confirmed = await confirm({
      title: `${userData?.id ? '¿Desea actualizar?' : '¿Desea crear?'}`,
      message: `${form.data.id ? 'Se actualizará el ' : 'Se creará el '} usuario "${form.data.name}"`,
      confirmButtonText: `${form.data.id ? 'Sí, Actualizar' : 'Sí, Crear'}`,
      cancelButtonText: 'Cancelar',
    });
    if (!confirmed) return
    if (form.data.id) {
      form.put(route('admin.users.update', form.data.id), {
        onSuccess: ({ props }) => {
          const flash = props?.flash as Flash | undefined;
          if (flash?.type == 'success') {
            onClose();
          }
          router.flushAll(); // limpia cache
        }
      })
    } else {
      form.post(route('admin.users.store'), {
        onSuccess: ({ props }) => {
          const flash = props?.flash as Flash | undefined;
          if (flash?.type == 'success') {
            onClose();
          }
          router.flushAll(); // limpia cache
        }
      });
    }
  };

  useEffect(() => {
    getAllRoles()
  }, []);

  useEffect(() => {
    if (userId) {
      getUser(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!userData) return;
    const dataForm: UserFormT = {
      id: userData.id,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      password: '',
      password_confirmation: '',
      roles_ids: userData.roles_ids
    }
    form.setData(dataForm)
    form.setDefaults(dataForm);
  }, [userData])

  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
      {/* CARD LOADER */}
      <Card className={`lg:mx-auto w-full max-w-2xl ${!userIsLoading ? 'hidden' : ''}`}>
        <CardHeader>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-10">
          <Skeleton className="h-8 bg-gray-300 dark:bg-black" />
          <Skeleton className="h-8 w-1/2 bg-gray-300 dark:bg-black" />
          <div className='grid gap-10 lg:gap-6 lg:grid-cols-2'>
            <Skeleton className="col-span-1 h-8 bg-gray-300 dark:bg-black" />
            <Skeleton className="col-span-1 h-8 bg-gray-300 dark:bg-black" />
          </div>
            <Skeleton className="h-8 bg-gray-300 dark:bg-black" />
          <div className='flex justify-end'>
            <Skeleton className="h-8 w-1/5 bg-black" />
          </div>
        </CardContent>
      </Card>
      {/* CARD CONTENT */}
      <Card className={`lg:mx-auto w-full max-w-2xl ${userIsLoading ? 'hidden' : ''}`}>
        <CardHeader>
          <CardTitle className='flex justify-between'>
            <div>{`${userId ? 'Actualizar ' : 'Nuevo '} usuario`}</div>
            <div onClick={handleClose} className='cursor-pointer'><X /></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 lg:px-8">
          <form onSubmit={submit} className='flex flex-col gap-4' autoComplete='off'>
            <div className='grid lg:grid-cols-12 gap-6'>
              {/* name */}
              <FieldSet className='lg:col-span-12 grid gap-2'>
                <Label htmlFor='name'>Nombre completo</Label>
                <Input
                  id='name'
                  type='text'
                  name='name'
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                />
                <InputError message={form.errors.name} />
              </FieldSet>
              {/* username */}
              <FieldSet className='lg:col-span-6 grid gap-2'>
                <Label htmlFor='username'>Nombre de usuario</Label>
                <Input
                  id='username'
                  type='text'
                  name='username'
                  disabled={!!form.data.id}
                  value={form.data.username}
                  onChange={(e) => form.setData('username', e.target.value)}
                />
                <InputError message={form.errors.username} />
              </FieldSet>
              {/* email */}
              <FieldSet className='lg:col-span-6 grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='text'
                  name='email'
                  value={form.data.email || ''}
                  onChange={(e) => form.setData('email', e.target.value)}
                />
                <InputError message={form.errors.email} />
              </FieldSet>
              {/* password */}
              <FieldSet className={`lg:col-span-6 grid gap-2 ${form.data.id ? 'hidden ' : ''}`}>
                <Label htmlFor='password'>Contraseña</Label>
                <Input
                  id='password'
                  type='password'
                  name='password'
                  disabled={!!form.data.id}
                  value={form.data.password || ''}
                  onChange={(e) => form.setData('password', e.target.value)}
                />
                <InputError message={form.errors.password} />
              </FieldSet>
              {/* password_confirmation */}
              <FieldSet className={`lg:col-span-6 grid gap-2 ${form.data.id ? 'hidden ' : ''}`}>
                <Label htmlFor='password_confirmation'>Confirmar contraseña</Label>
                <Input
                  id='password_confirmation'
                  type='password'
                  name='password_confirmation'
                  value={form.data.password_confirmation || ''}
                  onChange={(e) => form.setData('password_confirmation', e.target.value)}
                />
                <InputError message={form.errors.password_confirmation} />
              </FieldSet>
              <div className='lg:col-span-12'>
                <div className='text-sm font-medium mt-4 mb-2'>Roles (Seleccionar solo uno)</div>
                <div className="md:columns-2 lg:columns-4 gap-2">
                  {rolesData?.map((role) => (
                    <div key={role.id}>
                      <label>
                        <input
                          type="checkbox"
                          name="roles_ids[]"
                          checked={form.data.roles_ids.includes(role.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              form.setData('roles_ids', [...form.data.roles_ids, role.id]);
                            } else {
                              form.setData('roles_ids', form.data.roles_ids.filter((id: number) => id !== role.id));
                            }
                          }}
                        />
                        <span> {role.name}</span>
                      </label>
                    </div>
                  ))}
                </div>

              </div>
            </div>
            <div className='flex justify-end'>
              <Button
                type='submit'
                className='mt-4 w-fit cursor-pointer'
                disabled={!form.isDirty}
              >
                {`${userId ? 'Actualizar' : 'Crear'}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
