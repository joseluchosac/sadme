import { TableCell, TableRow } from "@/components/ui/custom/table-nowrap";
import { Labtest, LabtestItem, TableColumn } from "@/types";
import { router } from "@inertiajs/react";
import { useAlertDialog } from "@/components/alert_dialog/use-alert-dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import MenuItem from "./menu-item";
import { useLabtestsStore } from "@/store/labtests-store";

interface LabtestsTableRowProps {
  labtest: LabtestItem;
}

export default function LabtestsTableRow({ labtest }: LabtestsTableRowProps) {
  const columns = useLabtestsStore(state => state.columns);
  const selectedRowId = useLabtestsStore(state => state.selectedRowId);
  const setSelectedRowId = useLabtestsStore(state => state.setSelectedRowId);

  const columnsShow = columns.filter(col => col?.show);

  const { confirm } = useAlertDialog();

  const setStatus = async (labtest: Labtest) => {
    const confirmed = await confirm({
      title: `Confirmar ${labtest.status == 1 ? 'desactivación' : 'activación'}`,
      message: `¿Desea ${labtest.status == 1 ? 'desactivar' : 'activar'} el labtesto "${labtest.name}"?`,
      confirmButtonText: `${labtest.status == 1 ? 'desactivar' : 'activar'}`,
      cancelButtonText: 'Cancelar',
    });
    if (!confirmed) return;
    router.patch(route('labtests.set-status', labtest.id?.toString()));
  }

  const destroyLabtest = async (labtest: Labtest) => {
    const confirmed = await confirm({
      title: `Confirmar eliminación definitiva`,
      message: `¿Desea eliminar el labtesto "${labtest.name}" definitivamente?`,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!confirmed) return;
    router.delete(route('labtests.destroy', labtest.id?.toString()));
  }

  return (
    <>
      <TableRow
        key={labtest.id}
        className={`
          ${selectedRowId === labtest.id ? ' bg-green-400/25 hover:bg-green-400/25' : ''} hidden md:table-row
        `}
        onClick={e => {
          setSelectedRowId(labtest.id || 0);
        }}
      >
        {columnsShow.map((col) => (
          <Cell
            key={col.key}
            col={col}
            labtest={labtest}
            setStatus={setStatus}
            destroyLabtest={destroyLabtest}
          />
        ))}
      </TableRow>
      <TableRow className="md:hidden">
        <TableCell colSpan={columnsShow.length}>
          <div className="grid grid-cols-12 gap-1 p-6 max-w-md mx-auto">
            {columnsShow.map((col) => (
              <Item
                key={col.key}
                col={col}
                labtest={labtest}
                setStatus={setStatus}
                destroyLabtest={destroyLabtest}
              />
            ))}
          </div>
        </TableCell>
      </TableRow>
    </>
  )
}



// ----------------------------------------------------------
//   COMPONENTE Cell
// ----------------------------------------------------------
interface CellProps {
  col: TableColumn;
  labtest: LabtestItem;
  setStatus: (labtest: Labtest) => void;
  destroyLabtest: (labtest: Labtest) => void;
}
function Cell({ col, labtest, setStatus, destroyLabtest }: CellProps) {
  const setViewForm = useLabtestsStore(state => state.setViewForm);
  switch (col.key) {
    case 'actions': {
      return (
        <TableCell key={col.key}>
          <MenuItem
            labtest={labtest}
            setStatus={setStatus}
            destroyLabtest={destroyLabtest}
          />
        </TableCell>
      )
    }
    case 'code': {
      return (
        <TableCell key={col.key}>
          <div
            className="py-1 rounded-md cursor-pointer text-link"
            onClick={() => {
              setViewForm(labtest.id || null);
            }}
          >
            {labtest.code}
          </div>
        </TableCell>
      )
    }
    case 'status': {
      return (
        <TableCell key={col.key} className={cn(col.className)}>
          <Badge className={`${labtest.status == 0 ? 'bg-red-500, hover:bg-red-500' : 'hover:bg-blue-500 bg-blue-500'}`}>
            {labtest.status == 0 ? 'INACTIVO' : 'ACTIVO'}
          </Badge>
        </TableCell>
      )
    }
    default: {
      const value = labtest[col.key as keyof Labtest];
      return (
        <TableCell key={col.key} className={cn(col.className, `${labtest.status == 0 ? 'text-muted01' : ''}`)}>
          {typeof value === 'object' && value !== null
            ? '' // O una propiedad específica como value.name
            : value
          }
        </TableCell>
      )
    }
  }
}

// ----------------------------------------------------------
//   COMPONENTE Item
// ----------------------------------------------------------
interface ItemProps {
  col: TableColumn;
  labtest: LabtestItem;
  setStatus: (labtest: Labtest) => void;
  destroyLabtest: (labtest: Labtest) => void;
}
function Item({ col, labtest, setStatus, destroyLabtest }: ItemProps) {
  const setViewForm = useLabtestsStore(state => state.setViewForm);
  switch (col.key) {
    case 'actions': {
      return (
        <div key={col.key} className="col-span-12 flex  justify-end">
          <MenuItem
            labtest={labtest}
            setStatus={setStatus}
            destroyLabtest={destroyLabtest}
          />
        </div>
      )
    }
    case 'name': {
      return (
        <div key={col.key} className={cn('order-3 col-span-12 text-lg text-center')}>
            {labtest.name}
        </div>
      )
    }
    case 'code': {
      return (
        <div key={col.key} className={cn('col-span-12 flex gap-3 order-5')}>
          <div className="text-muted01">{col.label}:</div>
          <div
            className="rounded-md cursor-pointer text-link"
            onClick={() => {
              setViewForm(labtest.id || null);
            }}
          >
            {labtest.code}
          </div>
        </div>
      )
    }
    case 'status': {
      return (
        <div key={col.key} className={cn('order-11 col-span-12 flex justify-center')}>
          <Badge className={`${labtest.status == 0 ? 'bg-red-500' : 'bg-blue-500'}`}>
            {labtest.status == 0 ? 'INACTIVO' : 'ACTIVO'}
          </Badge>
        </div>
      )
    }
    default: {
      const value = labtest[col.key as keyof Labtest];
      return (
        <div className="col-span-12 flex gap-3 jus order-10">
          <div className="text-muted01">{col.label}:</div>
          <div key={col.key} className={cn(`${labtest.status == 0 ? 'text-muted01' : ''}`)}>
            {typeof value === 'object' && value !== null
              ? '' // O una propiedad específica como value.name
              : value
            }
          </div>
        </div>
      )
    }
  }
}