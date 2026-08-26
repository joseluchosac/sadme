import { useAlertDialog } from '@/components/alert_dialog/use-alert-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { productFormSchema, ProductFormT } from '@/schemas/product-schema';
import { Flash, ProductData, } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Edit, Trash, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useProductsStore } from '@/store/products-store';
import { CustomTextarea } from '@/components/ui/custom/custom-textarea';
import useService from '@/hooks/use-service';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { useCatalogsStore } from '@/store/catalogs-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MiQuillEditor from '@/components/custom/mi-quill-editor';

const formInit: ProductFormT = {
  id: 0,
  code: '',
  name: '',
  unit_code: '',
  price: 0,
  min_stock: 0,
  brand: null,
  barcode: null,
  category_id: 0,
  affectation_type_id: 0,
  description: '',
  details: '',
  features: null,
  observations: null,
  notes: null,
  show_price: 1,
  status: 1,
};

export default function ProductForm() {
  const productId = useProductsStore(state => state.productId)
  const setView = useProductsStore(state => state.setView)
  const setProductId = useProductsStore(state => state.setProductId)
  const { categories, units, affectationTypes } = useCatalogsStore(state => state)
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

  const handlePdf = () => {
    window.open(route('products.product-pdf',{product: form.data.id}), '_blank');
  }
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
      category_id: data.category_id,
      affectation_type_id: data.affectation_type_id,
      description: data.description || '',
      details: data.details || '',
      features: data.features || null,
      observations: data.observations || null,
      notes: data.notes || null,
      show_price: data.show_price,
      status: data.status,
    }
 
    form.setData(product);
    form.setDefaults(product);
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error])

  // Features state
  const [featureKey, setFeatureKey] = useState('');
  const [featureValue, setFeatureValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddFeature = () => {
    if (!featureKey.trim() || !featureValue.trim()) return;
    const features = form.data.features ? [...form.data.features] : [];
    features.push([featureKey.trim(), featureValue.trim()]);
    form.setData('features', features);
    setFeatureKey('');
    setFeatureValue('');
  };

  const handleUpdateFeature = () => {
    if (editIndex === null || !featureKey.trim() || !featureValue.trim()) return;
    const features = [...(form.data.features || [])];
    features[editIndex] = [featureKey.trim(), featureValue.trim()];
    form.setData('features', features);
    setEditIndex(null);
    setFeatureKey('');
    setFeatureValue('');
  };

  const handleDeleteFeature = (index: number) => {
    const features = (form.data.features || []).filter((_, i) => i !== index);
    form.setData('features', features.length ? features : null);
    if (editIndex === index) {
      setEditIndex(null);
      setFeatureKey('');
      setFeatureValue('');
    }
  };

  const handleStartEdit = (index: number) => {
    const features = form.data.features;
    if (!features || !features[index]) return;
    setEditIndex(index);
    setFeatureKey(features[index][0]);
    setFeatureValue(features[index][1]);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setFeatureKey('');
    setFeatureValue('');
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl relative">
      <Card className='lg:mx-auto max-w-2xl overflow-hidden'>
        <CardHeader className='p-4'>
          <CardTitle className='flex justify-between '>
            <div className='text-indigo-500'>{`${productId ? 'Actualizar ' : 'Crear '} producto`}</div>
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
              <fieldset className='flex flex-col gap-2 lg:col-span-4'>
                <Label htmlFor='unit_code'>Unidad</Label>
                <NativeSelect
                  className='dark:[color-scheme:dark]'
                  id='unit_code'
                  name='unit_code'
                  value={form.data.unit_code}
                  onChange={(e) => form.setData('unit_code', e.target.value)}
                >
                  <NativeSelectOption value=''>- Seleccione -</NativeSelectOption>
                  {units && units.map((unit) => (
                    <NativeSelectOption key={unit.code} value={unit.code}>
                      {`${unit.code} - ${unit.name}`}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <InputError message={form.errors.unit_code} />
              </fieldset>
              {/* category_id */}
              <fieldset className='flex flex-col gap-2 lg:col-span-5'>
                <Label htmlFor='category_id'>Categoría</Label>
                <NativeSelect
                  className='dark:[color-scheme:dark] w-full'
                  id='category_id'
                  name='category_id'
                  value={String(form.data.category_id)}
                  onChange={(e) => form.setData('category_id', Number(e.target.value))}
                >
                  <NativeSelectOption value='0'>- Seleccione -</NativeSelectOption>
                  {categories && categories.map((category) => (
                    <NativeSelectOption key={category.id} value={category.id}>
                      {category.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <InputError message={form.errors.category_id} />
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
              {/* details */}
              <fieldset className='flex flex-col gap-2 lg:col-span-12'>
                <Label htmlFor='details'>Detalles</Label>
                <MiQuillEditor
                    value={form.data.details}
                    onChange={(html) => form.setData('details', html)}
                    error={form.errors.details}
                />
                <InputError message={form.errors.details} />
              </fieldset>
              {/* details */}
              {/* <div
                id='preview-quill'
                className='lg:col-span-12'
                dangerouslySetInnerHTML={{ __html: form.data.details }}
              ></div> */}
              {/* <fieldset className='flex flex-col gap-2 lg:col-span-12'>
                <Label htmlFor='details'>Detalles</Label>
                <CustomTextarea
                  id='details'
                  name='details'
                  rows={4}
                  value={form.data.details ?? ''}
                  onChange={(e) => form.setData('details', e.target.value)}
                />
                <InputError message={form.errors.details} />
              </fieldset> */}
              {/* observations */}
              <fieldset className='flex flex-col gap-2 lg:col-span-12'>
                <Label htmlFor='observations'>Observaciones</Label>
                <Input
                  aria-invalid
                  id='observations'
                  type='text'
                  name='observations'
                  value={form.data.observations ?? ''}
                  onChange={(e) => form.setData('observations', e.target.value)}
                // disabled={mode == 'show'}
                />
                <InputError message={form.errors.observations} />
              </fieldset>
              {/* notes */}
              <fieldset className='flex flex-col gap-2 lg:col-span-12'>
                <Label htmlFor='notes'>Notas (uso interno)</Label>
                <Input
                  aria-invalid
                  id='notes'
                  type='text'
                  name='notes'
                  value={form.data.notes ?? ''}
                  onChange={(e) => form.setData('notes', e.target.value)}
                // disabled={mode == 'show'}
                />
                <InputError message={form.errors.notes} />
              </fieldset>
              <div className='flex flex-col gap-2 lg:col-span-12'>
                <Tabs className='col-span-12' defaultValue="features">
                  <TabsList>
                    <TabsTrigger value="features">Características</TabsTrigger>
                    <TabsTrigger value="contable" className={(form.errors.price) && 'text-red-500'}>Contable</TabsTrigger>
                  </TabsList>
                  <TabsContent value="features">
                    <div className="rounded-md border px-4 py-2 text-sm grid lg:grid-cols-12 gap-3 pt-4">
                      <div className='flex flex-col gap-2 lg:col-span-12'>
                        {form.data.features && form.data.features.map((el, idx) => (
                          <div key={idx} className='flex items-center gap-2'>
                            <span className='font-medium min-w-[120px]'>{el[0]}:</span>
                            <span className='flex-1'>{el[1]}</span>
                            <Edit
                              className='cursor-pointer text-blue-500 hover:text-blue-700 shrink-0'
                              size={16}
                              onClick={() => handleStartEdit(idx)}
                            />
                            <Trash
                              className='cursor-pointer text-red-500 hover:text-red-700 shrink-0'
                              size={16}
                              onClick={() => handleDeleteFeature(idx)}
                            />
                          </div>
                        ))}
                        <div className='flex flex-col gap-2 lg:col-span-6 mt-2'>
                          <Label>{editIndex !== null ? 'Editar característica' : 'Nueva característica'}</Label>
                          <div className='flex gap-2'>
                            <Input
                              className='h-8'
                              placeholder='Clave'
                              value={featureKey}
                              onChange={(e) => setFeatureKey(e.target.value)}
                            />
                            <Input
                              className='h-8'
                              placeholder='Valor'
                              value={featureValue}
                              onChange={(e) => setFeatureValue(e.target.value)}
                            />
                            {editIndex !== null ? (
                              <>
                                <Button className='h-8' type='button' variant='outline' onClick={handleUpdateFeature}>
                                  Guardar
                                </Button>
                                <Button className='h-8' type='button' variant='ghost' onClick={handleCancelEdit}>
                                  Cancelar
                                </Button>
                              </>
                            ) : (
                              <Button className='h-8' type='button' variant='outline' onClick={handleAddFeature}>
                                Agregar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="contable">
                    <div className="rounded-md border px-4 py-2 text-sm grid lg:grid-cols-12 gap-3 pt-4">
                      {/* affectation_type_id */}
                      <fieldset className='flex flex-col gap-2 lg:col-span-4'>
                        <Label htmlFor='affectation_type_id'>Afectación IGV</Label>
                        <NativeSelect
                          className='dark:[color-scheme:dark]'
                          id='affectation_type_id'
                          name='affectation_type_id'
                          value={String(form.data.affectation_type_id)}
                          onChange={(e) => form.setData('affectation_type_id', Number(e.target.value))}
                        >
                          <NativeSelectOption value='0'>- Seleccione -</NativeSelectOption>
                          {affectationTypes && affectationTypes.map((affectationType) => (
                            <NativeSelectOption key={affectationType.id} value={affectationType.id}>
                              {affectationType.name} ({+affectationType.tax_percentage}%)
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                        <InputError message={form.errors.affectation_type_id} />
                      </fieldset>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              {/* show_price */}
              <fieldset className='flex items-center gap-2 lg:col-span-12'>
                <Checkbox
                  id='show_price'
                  checked={form.data.show_price === 1}
                  onCheckedChange={(checked) => form.setData('show_price', checked === true ? 1 : 0)}
                />
                <Label htmlFor='show_price'>Mostrar precio</Label>
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
            {/* <div className='flex flex-col gap-2 mt-4'>
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
            </div> */}
            <div className='flex justify-end'>
              <Button
                variant={'outline'} 
                type='button' 
                className='mt-4 w-fit cursor-pointer'
                onClick={handlePdf}
              >
                <Spinner className={`${!form.processing && 'hidden'}`} data-icon="inline-start" />
                  Pdf
                </Button>
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
