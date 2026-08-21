import { useAlertDialog } from '@/components/alert_dialog/use-alert-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import usePermissionService from '@/hooks/use-permission-service';
import { permissionFormSchema, PermissionFormT } from '@/schemas/permission-schema';

import { Flash, Permission } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';

const formInit: PermissionFormT = {
  id: null,
  name: '',
};

type PermissionFormProps = {
  permissionId: number | null;
  onClose: () => void;
}

export default function PermissionForm({ permissionId, onClose }: PermissionFormProps) {
  const form = useForm(formInit);
  const { getPermission, data, isLoading } = usePermissionService<Permission>()
  const { confirm } = useAlertDialog()

  const handleClose = async () => {
    onClose();
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.clearErrors();
    const result = permissionFormSchema.safeParse(form.data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        form.setError(issue.path[0] as keyof PermissionFormT, issue.message);
      });
      return;
    }
    const confirmed = await confirm({
      title: `${data?.id ? '¿Desea actualizar?' : '¿Desea crear?'}`,
      message: `${form.data.id ? 'Se actualizará el ' : 'Se creará el '} permiso "${form.data.name}"`,
      confirmButtonText: `${form.data.id ? 'Sí, Actualizar' : 'Sí, Crear'}`,
      cancelButtonText: 'Cancelar',
    });
    if (!confirmed) return
    if (form.data.id) {
      form.put(route('admin.permissions.update', form.data.id), {
        onSuccess: ({ props }) => {
          const flash = props?.flash as Flash | undefined;
          if (flash?.type == 'success') {
            onClose();
          }
          router.flushAll(); // limpia cache
        }
      })
    } else {
      form.post(route('admin.permissions.store'), {
        onSuccess: ({ props }) => {
          const flash = props?.flash as Flash | undefined;
          if (flash?.type == 'success') {
            onClose();
          }
          router.flushAll();
        }
      });
    }
  };

  useEffect(() => {
    if (permissionId) {
      getPermission(permissionId);
    }
  }, [permissionId]);

  useEffect(() => {
    if (!data) return;
    const dataForm: PermissionFormT = { id: data.id, name: data.name, }
    form.setData(dataForm);
    form.setDefaults(dataForm);
  }, [data]);

  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
      {/* CARD LOADER */}
      <Card className={`lg:mx-auto w-full max-w-xl ${!isLoading ? 'hidden' : ''}`}>
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
      <Card className={`lg:mx-auto w-full max-w-xl ${isLoading ? 'hidden' : ''}`}>
        <CardHeader>
          <CardTitle className='flex justify-between'>
            <div>{`${permissionId ? 'Actualizar ' : 'Nuevo '} permiso`}</div>
            <div onClick={handleClose} className='cursor-pointer'><X /></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 lg:px-8">
          <form onSubmit={submit} className='flex flex-col gap-4' autoComplete='off'>
            <div className='grid gap-6'>
              {/* name */}
              <FieldSet className='grid gap-2'>
                <Label htmlFor='name'>Permiso</Label>
                <Input
                  id='name'
                  type='text'
                  name='name'
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                />
                <InputError message={form.errors.name} />
              </FieldSet>
            </div>
            <div className='flex justify-end'>
              <Button
                type='submit'
                className='mt-4 w-fit cursor-pointer'
              >
                {`${permissionId ? 'Actualizar' : 'Crear'}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
