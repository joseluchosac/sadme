import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCatalogsStore } from "@/store/catalogs-store"
import { useProductsStore } from "@/store/products-store"
import { 
  // Category,
  ProductsQrystr } from "@/types"
import { InertiaFormProps } from "@inertiajs/react"
import { Filter } from "lucide-react"

interface FilterDialogProps {
  productsQrystr: InertiaFormProps<ProductsQrystr>;
}

export function FilterDialog({ productsQrystr, }: FilterDialogProps) {
  const columns = useProductsStore(state => state.columns);
  const setShow = useProductsStore(state => state.setShow);
  const productTypes = useCatalogsStore(state => state.productTypes);

  const currentSortField = productsQrystr.data.sortby?.split('-')[0];
  const currentSortOrder = productsQrystr.data.sortby?.split('-')[1] ?? 'asc';

  const changeSortField = (field: string) => {
    const sortby = field === '_null' ? null : field + '-' + currentSortOrder
    productsQrystr.setData('sortby', sortby)
  }

  const changeSortOrder = (order: string) => {
    if (!currentSortField) return;
    productsQrystr.setData('sortby', currentSortField + '-' + order)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" title="Filtros"><Filter /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <fieldset>
            <Label >Ordenar por</Label>
            <div className="grid grid-cols-12 gap-2">
              <div className="w-full col-span-9">
                <NativeSelect
                  className='w-full dark:[color-scheme:dark]'
                  size="sm"
                  value={currentSortField || '_null'}
                  onChange={(e) => changeSortField(e.currentTarget.value)}
                >
                  <NativeSelectOption value='_null'>Ninguno</NativeSelectOption>
                  {columns.filter(el => el.sortable).map((sortable) => (
                    <NativeSelectOption key={sortable.key} value={sortable.key}>
                      {sortable.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="col-span-3">
                <NativeSelect
                  className='w-full dark:[color-scheme:dark]'
                  size="sm"
                  value={currentSortOrder}
                  onChange={(e) => changeSortOrder(e.currentTarget.value)}
                >
                  <NativeSelectOption value='asc'>ASC</NativeSelectOption>
                  <NativeSelectOption value='desc'>DES</NativeSelectOption>
                </NativeSelect>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <Label >Tipo</Label>
            <NativeSelect
              className='w-full dark:[color-scheme:dark]'
              size="sm"
              value={productsQrystr.data.product_type_id?.toString()}
              onChange={(e) => {
                const value = e.currentTarget.value;
                productsQrystr.setData('product_type_id', +value);
              }}
            >
              <NativeSelectOption value=''>- Todos -</NativeSelectOption>
              {productTypes && productTypes.map(el => (
                <NativeSelectOption key={el.id} value={el.id}>{el.name}</NativeSelectOption>
              ))}
            </NativeSelect>
          </fieldset>
          <fieldset>
            <Label >Estado</Label>
            <NativeSelect
              className='w-full dark:[color-scheme:dark]'
              size="sm"
              value={productsQrystr.data.status?.toString()}
              onChange={(e) => {
                const value = e.currentTarget.value;
                productsQrystr.setData('status', value == '_null' ? null : value);
              }}
            >
              <NativeSelectOption value='_null'>- Todos -</NativeSelectOption>
              <NativeSelectOption value='1'>Activo</NativeSelectOption>
              <NativeSelectOption value='0'>Inactivo</NativeSelectOption>
            </NativeSelect>
          </fieldset>
          <FieldSet>
            <FieldLegend variant="label" className="mb-1">
              Mostrar columnas
            </FieldLegend>
            <ScrollArea className="h-30 rounded-md border px-4 py-1">
              <FieldGroup className="gap-2">
                {columns.filter(el => el.key != 'actions').map(el => (
                  <Field orientation="horizontal" key={el.key}>
                    <Checkbox
                      id={el.key}
                      checked={el.show}
                      disabled={el.key == "name" || el.key == 'sku'}
                      onCheckedChange={show => setShow(show, el.key)}
                    />
                    <FieldLabel htmlFor={el.key} className="text-sm">
                      {el.label}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
            </ScrollArea>
          </FieldSet>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
