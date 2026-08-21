import { useAlertDialog } from '@/components/alert_dialog/use-alert-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import usePermissionService from '@/hooks/use-permission-service';
import useRoleService from '@/hooks/use-role-service';
import { roleFormSchema, RoleFormT } from '@/schemas/role-schema';

import { Flash, Permission, RoleData } from '@/types';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';

const formInit: RoleFormT = {
  id: null,
  name: '',
  permissions_ids: [],
};

type RoleFormProps = {
  roleId: number | null;
  onClose: () => void;
}

export default function RoleForm({ roleId, onClose }: RoleFormProps) {
  const form = useForm(formInit);
  const { getRole, data: roleData, isLoading: roleIsLoading } = useRoleService<RoleData>()
  const { getAllPermissions, data: permissionsData, isLoading: permissionsIsLoading } = usePermissionService<Permission[]>()
  const { confirm } = useAlertDialog()

  const handleClose = async () => {
    onClose();
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.clearErrors();
    const result = roleFormSchema.safeParse(form.data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        form.setError(issue.path[0] as keyof RoleFormT, issue.message);
      });
      return;
    }
    const confirmed = await confirm({
      title: `${roleData?.id ? '¿Desea actualizar?' : '¿Desea crear?'}`,
      message: `${form.data.id ? 'Se actualizará el ' : 'Se creará el '} rol "${form.data.name}"`,
      confirmButtonText: `${form.data.id ? 'Sí, Actualizar' : 'Sí, Crear'}`,
      cancelButtonText: 'Cancelar',
    });
    if (!confirmed) return
    if (form.data.id) {
      form.put(route('admin.roles.update', form.data.id), {
        onSuccess: ({ props }) => {
          const flash = props?.flash as Flash | undefined;
          if (flash?.type == 'success') {
            onClose();
          }
        }
      })
    } else {
      form.post(route('admin.roles.store'), {
        onSuccess: ({ props }) => {
          const flash = props?.flash as Flash | undefined;
          if (flash?.type == 'success') {
            onClose();
          }
        }
      });
    }
  };

  useEffect(() => {
    getAllPermissions()
  }, []);

  useEffect(() => {
    if (roleId) {
      getRole(roleId);
    }
  }, [roleId]);

  useEffect(() => {
    if (!roleData) return;
    const dataForm: RoleFormT = {
      id: roleData.id,
      name: roleData.name,
      permissions_ids: roleData.permissions_ids
    }
    form.setData(dataForm);
    form.setDefaults(dataForm);
  }, [roleData]);

  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
      {/* CARD LOADER */}
      <Card className={`lg:mx-auto w-full max-w-xl ${!roleIsLoading ? 'hidden' : ''}`}>
        <CardHeader>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-10">
          <Skeleton className="h-8 bg-gray-300 dark:bg-black" />
          <div className='flex justify-end'>
            <Skeleton className="h-8 w-1/5 bg-gray-300 dark:bg-black" />
          </div>
        </CardContent>
      </Card>
      {/* CARD CONTENT */}
      <Card className={`lg:mx-auto w-full max-w-xl ${roleIsLoading ? 'hidden' : ''}`}>
        <CardHeader>
          <CardTitle className='flex justify-between'>
            <div>{`${roleId ? 'Actualizar ' : 'Nuevo '} rol`}</div>
            <div onClick={handleClose} className='cursor-pointer'><X /></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 lg:px-8">
          <form onSubmit={submit} className='flex flex-col gap-4' autoComplete='off'>
            <FieldSet>
              {/* name */}
              <FieldSet className='lg:col-span-12 grid gap-2'>
                <Label htmlFor='name'>Rol</Label>
                <Input
                  id='name'
                  type='text'
                  name='name'
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                />
                <InputError message={form.errors.name} />
              </FieldSet>
            </FieldSet>
            <div className='gap-1'>
              <div className='text-sm font-medium'>Permisos</div>
              <div className="sm:columns-2 gap-4">
                {permissionsData?.map((permission) => (
                  <div key={permission.id}>
                    <label className='text-nowrap'>
                      <input
                        type="checkbox"
                        name="permissions_ids[]"
                        checked={form.data.permissions_ids.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            form.setData('permissions_ids', [...form.data.permissions_ids, permission.id]);
                          } else {
                            form.setData('permissions_ids', form.data.permissions_ids.filter((id: number) => id !== permission.id));
                          }
                        }}
                      />
                      <span className='text-nowrap'> {permission.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex justify-end'>
              <Button
                type='submit'
                className='mt-4 w-fit cursor-pointer'
              >
                {`${roleId ? 'Actualizar' : 'Crear'}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
