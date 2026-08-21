import { TableBody, TableCell, TableHead, TableHeader, TableNowrap, TableRow } from "@/components/ui/custom/table-nowrap";
import { InertiaFormProps } from "@inertiajs/react";
import { Dispatch, SetStateAction } from "react";
import UsersColumnSort from "./users-column-sort";
import { UsersPaginated, Qrystr } from "@/types";
import UsersTableRow from "./users-table-row";
import { useUsersTableConfigStore } from "@/store/users-table-config-store";
import { cn } from "@/lib/utils";

interface UsersTableProps {
  users: UsersPaginated;
  usersQrystr: InertiaFormProps<Qrystr>;
  setUserId: Dispatch<SetStateAction<number | null>>;
  setView: Dispatch<SetStateAction<string>>;
}

export default function UsersTable({ users, usersQrystr, setUserId, setView }: UsersTableProps) {
  const columns = useUsersTableConfigStore(state => state.columns);
  return (
    <TableNowrap noWrapper>
      <TableHeader className="bg-fondo01 sticky top-0 z-10">
        <TableRow className=' hover:bg-fondo01'>
          {columns.filter(col => col.show).map((col) => (
            <TableHead key={col.key} className="text-blue-100">
              {col.sortable ? (
                <UsersColumnSort
                  col={col}
                  usersQrystr={usersQrystr}
                />
              ) : (
                <div className={cn(col.className)}>{col.label}</div>
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="text-[0.85rem]">
        {users.data && users.data.length ? (
          users.data.map((user) => (
            <UsersTableRow
              key={user.id}
              user={user}
              setUserId={setUserId}
              setView={setView}
            />
          ))
        ) : (
          <TableRow><TableCell colSpan={10} className="text-center">No hay registros para mostrar</TableCell></TableRow>
        )}
      </TableBody>
    </TableNowrap>
  )
}