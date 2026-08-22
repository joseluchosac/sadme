import { useAlertDialog } from '@/components/alert_dialog/use-alert-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { labtestFormSchema, LabtestFormT } from '@/schemas/labtest-schema';
import { Flash, LabtestData, } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FormEvent, useEffect,} from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useLabtestsStore } from '@/store/labtests-store';
import { CustomTextarea } from '@/components/ui/custom/custom-textarea';
import useService from '@/hooks/use-service';
import { toast } from 'sonner';

const formInit: LabtestFormT = {
  id: 0,
  code: '',
  name: '',
  area: '',
  sample: '',
  description: '',
  status: 1,
};

export default function LabtestForm() {
  const labtestId = useLabtestsStore(state => state.labtestId)
  const setView = useLabtestsStore(state => state.setView)
  const setLabtestId = useLabtestsStore(state => state.setLabtestId)
  const form = useForm(formInit);
  const { getLabtest, data, isLoading, error } = useService<LabtestData>()
  const { confirm } = useAlertDialog()

  const handleClose = async () => {
    setView('table')
    setLabtestId(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.clearErrors();
    const result = labtestFormSchema.safeParse(form.data);
    if (result.success) {
      const confirmed = await confirm({
        title: `${form.data.id ? '¿Estás seguro de actualizar?' : '¿Estás seguro de crear?'}`,
        message: `${form.data.id ? 'Actualizar ' : 'Crear '} el labtesto "${form.data.name}"`,
        confirmButtonText: `${form.data.id ? 'Actualizar' : 'Crear'}`,
        cancelButtonText: 'Cancelar',
      });
      if (!confirmed) return
      if (form.data.id) {
        form.put(route('labtests.update', form.data.id), {
          onSuccess: ({ props }) => {
            const flash = props?.flash as Flash | undefined;
            if (flash?.type == 'success') {
              setView('table')
              setLabtestId(null)
            }
            router.flushAll(); // limpia cache
          },
          onError: (algo) => {
            
          }
        })
      } else {
        form.post(route('labtests.store'), {
          onSuccess: ({ props }) => {
            const flash = props?.flash as Flash | undefined;
            if (flash?.type == 'success') {
              setView('table')
              setLabtestId(null)
            }
            router.flushAll(); // limpia cache
          }
        });
      }
    } else {
      result.error.issues.forEach((issue) => {
        form.setError(issue.path[0] as keyof LabtestFormT, issue.message);
      });
    }

  };

  // Efecto solicitar el labtesto
  useEffect(() => {
    if (labtestId) {
      getLabtest(labtestId);
    }
  }, [labtestId]);

  // efecto para actualizar el formulario con el labtesto solicitado
  useEffect(() => {
    if (!data) return;
    console.log('data', data)
    const pruduct: LabtestFormT = {
      id: data.id,
      code: data.code,
      name: data.name,
      area: data.area,
      sample: data.sample,
      description: data.description || '',
      status: data.status,
    }
    // setPreview(data.image_url || null)
    form.setData(pruduct);
    form.setDefaults(pruduct);
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error])

  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl relative">
      <Card className='lg:mx-auto max-w-3xl overflow-hidden'>
        <CardHeader className='p-4'>
          <CardTitle className='flex justify-between '>
            <div>{`${labtestId ? 'Actualizar ' : 'Crear '} exámen`}</div>
            <div onClick={handleClose} className='cursor-pointer'><X /></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-8 lg:pt-6 relative">
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div className='grid lg:grid-cols-12 gap-4'>
              {/* CODE */}
              <fieldset className='flex flex-col gap-2 lg:col-span-2'>
                <Label htmlFor='code'>Código</Label>
                <Input
                  id='code'
                  type='text'
                  name='code'
                  value={form.data.code}
                  onChange={(e) => form.setData('code', e.target.value)}
                // disabled={mode == 'show'}
                />
                <InputError message={form.errors.code} />
              </fieldset>
              {/* NAME */}
              <fieldset className='flex flex-col gap-2 lg:col-span-10'>
                <Label htmlFor='name'>Nombre</Label>
                <Input
                  aria-invalid
                  id='name'
                  type='text'
                  name='name'
                  autoFocus
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                // disabled={mode == 'show'}
                />
                <InputError message={form.errors.name} className='-mt-1' />
              </fieldset>
              {/* AREA */}
              <fieldset className='flex flex-col gap-2 lg:col-span-6'>
                <Label htmlFor='area'>Área</Label>
                <Input
                  id='area'
                  type='text'
                  name='area'
                  value={form.data.area || ''}
                  onChange={(e) => form.setData('area', e.target.value)}
                />
                <InputError message={form.errors.area} />
              </fieldset>
              {/* SAMPLE */}
              <fieldset className='flex flex-col gap-2 lg:col-span-6'>
                <Label htmlFor='sample'>Muestra</Label>
                <Input
                  id='sample'
                  type='text'
                  name='sample'
                  value={form.data.sample || ''}
                  onChange={(e) => form.setData('sample', e.target.value)}
                />
                <InputError message={form.errors.sample} />
              </fieldset>
              {/* DESCRIPTION */}
              <fieldset className='flex flex-col gap-2 lg:col-span-12'>
                <Label htmlFor='description'>Descripción</Label>
                <CustomTextarea
                  id='description'
                  name='description'
                  rows={1}
                  value={form.data.description ?? ''}
                  onChange={(e) => form.setData('description', e.target.value)}
                />
                <InputError message={form.errors.description} />
              </fieldset>
            </div>
            <div className='flex justify-end'>
              <Button type='submit' className='mt-4 w-fit cursor-pointer' disabled={!form.isDirty || form.processing}>
                <Spinner className={`${!form.processing && 'hidden'}`} data-icon="inline-start" />
                Guardar
              </Button>
            </div>
          </form>
          {isLoading && (
            <div className='bg-gray-300/50 dark:bg-gray-800/50 absolute top-0 left-0 bottom-0 right-0'>
              <Spinner className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-5' />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
