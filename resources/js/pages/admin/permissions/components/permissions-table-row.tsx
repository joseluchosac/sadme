import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/custom/table-nowrap";
import { TableColumn, PermissionItem } from "@/types";
import { router } from "@inertiajs/react";
import { Pencil, Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useAlertDialog } from "@/components/alert_dialog/use-alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { usePermissionsTableConfigStore } from "@/store/permissions-table-config-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PermissionsTableRowProps {
  permission: PermissionItem;
  setPermissionId: Dispatch<SetStateAction<number | null>>;
  setView: Dispatch<SetStateAction<string>>;
}

export default function PermissionsTableRow({ permission, setPermissionId, setView }: PermissionsTableRowProps) {
  const columns = usePermissionsTableConfigStore(state => state.columns);
  const selectedRowId = usePermissionsTableConfigStore(state => state.selectedRowId);
  const setSelectedRowId = usePermissionsTableConfigStore(state => state.setSelectedRowId);

  return (
    <TableRow
      key={permission.id}
      className={`
        ${selectedRowId === permission.id ? ' bg-green-400/25 hover:bg-green-400/25' : ''} 
      `}
      onClick={e => {
        setSelectedRowId(permission.id || 0);
      }}
    >
      {columns.filter(col => col?.show).map((col) => (
        <Cell
          key={col.key}
          col={col}
          permission={permission}
          setPermissionId={setPermissionId}
          setView={setView}
        />
      ))}
    </TableRow>
  )
}



// -----------------------
//   COMPONENTE CELL
// -----------------------
interface CellProps {
  col: TableColumn;
  permission: PermissionItem;
  setPermissionId: Dispatch<SetStateAction<number | null>>;
  setView: Dispatch<SetStateAction<string>>;
}
function Cell({ col, permission, setPermissionId, setView }: CellProps) {
  const [destroying, setDestroying] = useState(false);
  const { confirm } = useAlertDialog();

  const destroyPermission = async (permission: PermissionItem) => {
    const confirmed = await confirm({
      title: `Confirmar eliminación definitiva`,
      message: `¿Desea eliminar el permiso "${permission.name}" definitivamente?`,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!confirmed) return;
    setDestroying(true);
    router.delete(route('admin.permissions.destroy', permission.id?.toString()), {
      preserveScroll: true,
      onSuccess: () => router.flushAll(),
      onFinish: () => {
        setDestroying(false);
      }
    });
  }

  switch (col.key) {
    case 'actions': {
      return (
        <TableCell key={col.key} className='flex gap-2'>
          <Button
            disabled={destroying}
            className='cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-600/90'
            onClick={() => {
              setPermissionId(permission.id);
              setView('form');
            }}
            size={'sm'}
          >
            <Pencil size={15} />
          </Button>
          <Button
            disabled={destroying}
            className='cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:bg-red-600/90'
            size={'sm'}
            onClick={e => { destroyPermission(permission) }}
          >
            {destroying ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Trash size={15} />
            )}
          </Button>
        </TableCell>
      )
    }
    case 'roles': {
      return (
        <TableCell key={col.key} className={cn(col.className)}>
          <div className='flex flex-wrap gap-2'>
            {permission?.roles?.map(el => (<Badge key={el.id}>{el.name}</Badge>))}
          </div>
        </TableCell>
      )
    }
    default: {
      const value = permission[col.key as keyof PermissionItem];
      return (
        <TableCell key={col.key} className={cn(col.className)}>
          {typeof value === 'object' && value !== null
            ? '' // O una propiedad específica como value.name
            : value
          }
        </TableCell>
      );
    }
  }
}
