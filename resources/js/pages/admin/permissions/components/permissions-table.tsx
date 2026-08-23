import { TableBody, TableCell, TableHead, TableHeader, TableNowrap, TableRow } from "@/components/ui/custom/table-nowrap";
import { InertiaFormProps } from "@inertiajs/react";
import { Dispatch, SetStateAction } from "react";
import PermissionsColumnSort from "./permissions-column-sort";
import { PermissionsPaginated, Qrystr } from "@/types";
import PermissionsTableRow from "./permissions-table-row";
import { usePermissionsStore } from "@/store/permissions-store";
import { cn } from "@/lib/utils";

interface PermissionsTableProps {
  permissions: PermissionsPaginated;
  permissionsQrystr: InertiaFormProps<Qrystr>;
  setPermissionId: Dispatch<SetStateAction<number | null>>;
  setView: Dispatch<SetStateAction<string>>;
}

export default function PermissionsTable({ permissions, permissionsQrystr, setPermissionId, setView }: PermissionsTableProps) {
  const columns = usePermissionsStore(state => state.columns);
  return (
    <TableNowrap noWrapper>
      <TableHeader className="bg-fondo01 sticky top-0 z-10">
        <TableRow className=' hover:bg-fondo01'>
          {columns.filter(col => col.show).map((col) => (
            <TableHead key={col.key} className="text-blue-100">
              {col.sortable ? (
                <PermissionsColumnSort
                  col={col}
                  permissionsQrystr={permissionsQrystr}
                />
              ) : (
                <div className={cn(col.className)}>{col.label}</div>
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="text-[0.85rem]">
        {permissions.data && permissions.data.length ? (
          permissions.data.map((permission) => (
            <PermissionsTableRow
              key={permission.id}
              permission={permission}
              setPermissionId={setPermissionId}
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