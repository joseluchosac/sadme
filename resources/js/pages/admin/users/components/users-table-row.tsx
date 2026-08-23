import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/custom/table-nowrap";
import { TableColumn, UserItem } from "@/types";
import { router } from "@inertiajs/react";
import { Pencil, Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useAlertDialog } from "@/components/alert_dialog/use-alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useUsersStore } from "@/store/users-store";

interface UsersTableRowProps {
  user: UserItem;
  setUserId: Dispatch<SetStateAction<number | null>>;
  setView: Dispatch<SetStateAction<string>>;
}

export default function UsersTableRow({ user, setUserId, setView }: UsersTableRowProps) {
  const columns = useUsersStore(state => state.columns);
  const selectedRowId = useUsersStore(state => state.selectedRowId);
  const setSelectedRowId = useUsersStore(state => state.setSelectedRowId);

  return (
    <TableRow
      key={user.id}
      className={`
        ${selectedRowId === user.id ? ' bg-green-400/25 hover:bg-green-400/25' : ''} 
      `}
      onClick={e => {
        setSelectedRowId(user.id || 0);
      }}
    >
      {columns.filter(col => col?.show).map((col) => (
        <Cell
          key={col.key}
          col={col}
          user={user}
          setUserId={setUserId}
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
  user: UserItem;
  setUserId: Dispatch<SetStateAction<number | null>>;
  setView: Dispatch<SetStateAction<string>>;
}
function Cell({ col, user, setUserId, setView }: CellProps) {
  const [destroying, setDestroying] = useState(false);
  const { confirm } = useAlertDialog();

  const destroyUser = async (user: UserItem) => {
    const confirmed = await confirm({
      title: `Confirmar eliminación definitiva`,
      message: `¿Desea eliminar el usuario "${user.name}" definitivamente?`,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!confirmed) return;
    setDestroying(true);
    router.delete(route('admin.users.destroy', user.id?.toString()), {
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
            title="Editar usuario"
            onClick={() => {
              setUserId(user.id);
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
            title="Eliminar usuario"
            onClick={e => { destroyUser(user) }}
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
          <div className="flex flex-wrap gap-2">
            {user.roles.map(el => (<Badge key={el.id}>{el.name}</Badge>))}
          </div>
        </TableCell>
      )
    }
    default: {
      const value = user[col.key as keyof UserItem];
      return (
        <TableCell key={col.key} className={cn(col.className)}>
          {typeof value === 'object' && value !== null
            ? '' // O una propiedad específica como value.name
            : value
          }
        </TableCell>
      )
    }
  }
}
