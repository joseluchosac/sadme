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
import { useLabtestsStore } from "@/store/labtests-store"
import { 
  // Category,
  LabtestsQrystr } from "@/types"
import { InertiaFormProps } from "@inertiajs/react"
import { Filter } from "lucide-react"

interface FilterDialogProps {
  labtestsQrystr: InertiaFormProps<LabtestsQrystr>;
  // categories: Category[];
}

export function FilterDialog({ labtestsQrystr, /* categories */ }: FilterDialogProps) {
  const columns = useLabtestsStore(state => state.columns);
  const setShow = useLabtestsStore(state => state.setShow);

  const currentSortField = labtestsQrystr.data.sortby?.split('-')[0];
  const currentSortOrder = labtestsQrystr.data.sortby?.split('-')[1] ?? 'asc';

  const changeSortField = (field: string) => {
    const sortby = field === '_null' ? null : field + '-' + currentSortOrder
    labtestsQrystr.setData('sortby', sortby)
  }

  const changeSortOrder = (order: string) => {
    if (!currentSortField) return;
    labtestsQrystr.setData('sortby', currentSortField + '-' + order)
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
            <Label >Categoría</Label>
            {/* <NativeSelect
              className='w-full dark:[color-scheme:dark]'
              value={labtestsQrystr.data.category_id?.toString()}
              onChange={(e) => {
                const value = e.currentTarget.value;
                labtestsQrystr.setData('category_id', value === '' ? null : parseInt(value));
              }}
            >
              <NativeSelectOption value=''>- Todos -</NativeSelectOption>
              <NativeSelectOption value='0'>- Sin categoría -</NativeSelectOption>
              {categories && categories.map(el => (
                <NativeSelectOption key={el.id} value={el.id}>{el.name}</NativeSelectOption>
              ))}
            </NativeSelect> */}
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
