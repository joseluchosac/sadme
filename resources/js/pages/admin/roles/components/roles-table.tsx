import { TableBody, TableCell, TableHead, TableHeader, TableNowrap, TableRow } from "@/components/ui/custom/table-nowrap";
import { InertiaFormProps } from "@inertiajs/react";
import { Dispatch, SetStateAction } from "react";
import RolesColumnSort from "./roles-column-sort";
import { RolesPaginated, Qrystr } from "@/types";
import RolesTableRow from "./roles-table-row";
import { useRolesStore } from "@/store/roles-store";
import { cn } from "@/lib/utils";

interface RolesTableProps {
  roles: RolesPaginated;
  rolesQrystr: InertiaFormProps<Qrystr>;
  setRoleId: Dispatch<SetStateAction<number | null>>;
  setView: Dispatch<SetStateAction<string>>;
}

export default function RolesTable({ roles, rolesQrystr, setRoleId, setView }: RolesTableProps) {
  const columns = useRolesStore(state => state.columns);
  return (
    <TableNowrap noWrapper>
      <TableHeader className="bg-fondo01 sticky top-0 z-10">
        <TableRow className=' hover:bg-fondo01'>
          {columns.filter(col => col.show).map((col) => (
            <TableHead key={col.key} className="text-blue-100">
              {col.sortable ? (
                <RolesColumnSort
                  col={col}
                  rolesQrystr={rolesQrystr}
                />
              ) : (
                <div className={cn(col.className)}>{col.label}</div>
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="text-[0.85rem]">
        {roles.data && roles.data.length ? (
          roles.data.map((role) => (
            <RolesTableRow
              key={role.id}
              role={role}
              setRoleId={setRoleId}
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