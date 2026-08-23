import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/custom/table-nowrap";
import { TableColumn, RoleItem } from "@/types";
import { router } from "@inertiajs/react";
import { Pencil, Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useAlertDialog } from "@/components/alert_dialog/use-alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useRolesStore } from "@/store/roles-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface RolesTableRowProps {
  role: RoleItem;
  setRoleId: Dispatch<SetStateAction<number | null>>;
  setView: Dispatch<SetStateAction<string>>;
}

export default function RolesTableRow({ role, setRoleId, setView }: RolesTableRowProps) {
  const columns = useRolesStore(state => state.columns);
  const selectedRowId = useRolesStore(state => state.selectedRowId);
  const setSelectedRowId = useRolesStore(state => state.setSelectedRowId);

  return (
    <TableRow
      key={role.id}
      className={`
        ${selectedRowId === role.id ? ' bg-green-400/25 hover:bg-green-400/25' : ''} 
      `}
      onClick={e => {
        setSelectedRowId(role.id || 0);
      }}
    >
      {columns.filter(col => col?.show).map((col) => (
        <Cell
          key={col.key}
          col={col}
          role={role}
          setRoleId={setRoleId}
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
  role: RoleItem;
  setRoleId: Dispatch<SetStateAction<number | null>>;
  setView: Dispatch<SetStateAction<string>>;
}
function Cell({ col, role, setRoleId, setView }: CellProps) {
  const [destroying, setDestroying] = useState(false);
  const { confirm } = useAlertDialog();

  const destroyRole = async (role: RoleItem) => {
    const confirmed = await confirm({
      title: `Confirmar eliminación definitiva`,
      message: `¿Desea eliminar el rol "${role.name}" definitivamente?`,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!confirmed) return;
    setDestroying(true);
    router.delete(route('admin.roles.destroy', role.id?.toString()), {
      preserveScroll: true,
      preserveState: true,
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
              setRoleId(role.id);
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
            onClick={e => { destroyRole(role) }}
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
    case 'permissions': {
      return (
        <TableCell key={col.key} className={cn(col.className)}>
          <div className="flex flex-wrap gap-2">
            {role?.permissions?.map(el => (<Badge key={el.id}>{el.name}</Badge>))}
          </div>
        </TableCell>
      )
    }
    default: {
      const value = role[col.key as keyof RoleItem];
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
