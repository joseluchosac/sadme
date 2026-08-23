import { useAlertDialog } from '@/components/alert_dialog/use-alert-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { productFormSchema, ProductFormT } from '@/schemas/product-schema';
import { Flash, ProductData, ProductType, Unit, } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Edit, Trash, X } from 'lucide-react';
import { FormEvent, useEffect,} from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useProductsStore } from '@/store/products-store';
import { CustomTextarea } from '@/components/ui/custom/custom-textarea';
import useService from '@/hooks/use-service';
import { toast } from 'sonner';
import { TableBody, TableCell, TableNowrap, TableRow } from '@/components/ui/custom/table-nowrap';
import { Checkbox } from '@/components/ui/checkbox';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

const AFFECTATION_TYPES = [
  { id: 1, name: 'Gravado' },
  { id: 2, name: 'Exonerado' },
  { id: 3, name: 'Inafecto' },
];

const formInit: ProductFormT = {
  id: 0,
  code: '',
  name: '',
  unit_code: '',
  price: 0,
  min_stock: 0,
  brand: null,
  barcode: null,
  product_type_id: 0,
  affectation_type_id: 0,
  description: '',
  status: 1,
};

interface ProductFormProps {
  productTypes: ProductType[]
  units: Unit[]
}

export default function ProductForm({productTypes, units} : ProductFormProps) {
  const productId = useProductsStore(state => state.productId)
  const setView = useProductsStore(state => state.setView)
  const setProductId = useProductsStore(state => state.setProductId)
  const form = useForm(formInit);
  const { getProduct, data, isLoading, error } = useService<ProductData>()
  const { confirm } = useAlertDialog()

  const handleClose = async () => {
    setView('table')
    setProductId(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.clearErrors();
    const result = productFormSchema.safeParse(form.data);
    if (result.success) {
      const confirmed = await confirm({
        title: `${form.data.id ? '¿Estás seguro de actualizar?' : '¿Estás seguro de crear?'}`,
        message: `${form.data.id ? 'Actualizar ' : 'Crear '} el producto "${form.data.name}"`,
        confirmButtonText: `${form.data.id ? 'Actualizar' : 'Crear'}`,
        cancelButtonText: 'Cancelar',
      });
      if (!confirmed) return
      if (form.data.id) {
        form.put(route('products.update', form.data.id), {
          onSuccess: ({ props }) => {
            const flash = props?.flash as Flash | undefined;
            if (flash?.type == 'success') {
              setView('table')
              setProductId(null)
            }
            router.flushAll(); // limpia cache
          },
        })
      } else {
        form.post(route('products.store'), {
          onSuccess: ({ props }) => {
            const flash = props?.flash as Flash | undefined;
            if (flash?.type == 'success') {
              setView('table')
              setProductId(null)
            }
            router.flushAll(); // limpia cache
          }
        });
      }
    } else {
      result.error.issues.forEach((issue) => {
        form.setError(issue.path[0] as keyof ProductFormT, issue.message);
      });
    }

  };

  // Efecto solicitar el producto
  useEffect(() => {
    if (productId) {
      getProduct(productId);
    }
  }, [productId]);

  // efecto para actualizar el formulario con el producto solicitado
  useEffect(() => {
    if (!data) return;
    const product: ProductFormT = {
      id: data.id,
      code: data.code,
      name: data.name,
      unit_code: data.unit_code,
      price: Number(data.price),
      min_stock: data.min_stock,
      brand: data.brand || null,
      barcode: data.barcode || null,
      product_type_id: data.product_type_id,
      affectation_type_id: data.affectation_type_id,
      description: data.description || '',
      status: data.status,
    }
    // setPreview(data.image_url || null)
    form.setData(product);
    form.setDefaults(product);
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error])

  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl relative">
      <Card className='lg:mx-auto max-w-2xl overflow-hidden'>
        <CardHeader className='p-4'>
          <CardTitle className='flex justify-between '>
            <div>{`${productId ? 'Actualizar ' : 'Crear '} exámen`}</div>
            <div onClick={handleClose} className='cursor-pointer'><X /></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-8 lg:pt-6 relative">
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div className='grid lg:grid-cols-12 gap-4'>
              {/* code */}
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
              {/* name */}
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
              {/* unit_code */}
              <fieldset className='flex flex-col gap-2 lg:col-span-3'>
                <Label htmlFor='unit_code'>Unidad</Label>
                <NativeSelect
                  className='dark:[color-scheme:dark]'
                  id='unit_code'
                  name='unit_code'
                  value={form.data.unit_code}
                  onChange={(e) => form.setData('unit_code', e.target.value)}
                >
                  <NativeSelectOption value=''>- Seleccione -</NativeSelectOption>
                  {units.map((unit) => (
                    <NativeSelectOption key={unit.code} value={unit.code}>
                      {`${unit.code} - ${unit.name}`}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <InputError message={form.errors.unit_code} />
              </fieldset>
              {/* product_type_id */}
              <fieldset className='flex flex-col gap-2 lg:col-span-3'>
                <Label htmlFor='product_type_id'>Tipo</Label>
                <NativeSelect
                  className='dark:[color-scheme:dark]'
                  id='product_type_id'
                  name='product_type_id'
                  value={String(form.data.product_type_id)}
                  onChange={(e) => form.setData('product_type_id', Number(e.target.value))}
                >
                  <NativeSelectOption value='0'>- Seleccione -</NativeSelectOption>
                  {productTypes.map((productType) => (
                    <NativeSelectOption key={productType.id} value={productType.id}>
                      {productType.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <InputError message={form.errors.product_type_id} />
              </fieldset>
              {/* price */}
              <fieldset className='flex flex-col gap-2 lg:col-span-3'>
                <Label htmlFor='price'>Precio</Label>
                <Input
                  id='price'
                  type='number'
                  name='price'
                  min={0}
                  step='0.01'
                  value={form.data.price}
                  onChange={(e) => form.setData('price', Number(e.target.value))}
                />
                <InputError message={form.errors.price} />
              </fieldset>
              {/* affectation_type_id */}
              <fieldset className='flex flex-col gap-2 lg:col-span-3'>
                <Label htmlFor='affectation_type_id'>Afectación</Label>
                <NativeSelect
                  className='dark:[color-scheme:dark]'
                  id='affectation_type_id'
                  name='affectation_type_id'
                  value={String(form.data.affectation_type_id)}
                  onChange={(e) => form.setData('affectation_type_id', Number(e.target.value))}
                >
                  <NativeSelectOption value='0'>- Seleccione -</NativeSelectOption>
                  {AFFECTATION_TYPES.map((affectationType) => (
                    <NativeSelectOption key={affectationType.id} value={affectationType.id}>
                      {affectationType.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <InputError message={form.errors.affectation_type_id} />
              </fieldset>
              {/* description */}
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
              {/* status */}
              <fieldset className='flex items-center gap-2 lg:col-span-12'>
                <Checkbox
                  id='status'
                  checked={form.data.status === 1}
                  onCheckedChange={(checked) => form.setData('status', checked === true ? 1 : 0)}
                />
                <Label htmlFor='status'>Activo</Label>
              </fieldset>
            </div>
            <div className='flex flex-col gap-2 mt-4'>
              <Label htmlFor='description'>Precios</Label>
              <div className='border rounded-md overflow-hidden'>
                <TableNowrap>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        Normal
                      </TableCell>
                      <TableCell>
                        60.00
                      </TableCell>
                      <TableCell className='w-20'>
                        <div className='flex gap-2' >
                          <Edit
                            className='cursor-pointer text-blue-500'
                            size={20}
                          />
                          <Trash
                            className='cursor-pointer text-red-500'
                            size={20} 
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        Social
                      </TableCell>
                      <TableCell>
                        0.00
                      </TableCell>
                      <TableCell className='w-20'>
                        <div className='flex gap-2' >
                          <Edit
                            className='cursor-pointer text-blue-500'
                            size={20}
                          />
                          <Trash
                            className='cursor-pointer text-red-500'
                            size={20} 
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableNowrap>
              </div>
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
