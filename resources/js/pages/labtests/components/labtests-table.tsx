import { TableBody, TableCell, TableHead, TableHeader, TableNowrap, TableRow } from "@/components/ui/custom/table-nowrap";
import { LabtestsPaginated, LabtestsQrystr } from "@/types";
import { InertiaFormProps } from "@inertiajs/react";
import LabtestsColumnSort from "./labtests-column-sort";
import LabtestsTableRow from "./labtests-table-row";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Pagination } from "@/components/ui/custom/pagination";
import { useLabtestsStore } from "@/store/labtests-store";

interface LabtestsTableProps {
  labtests: LabtestsPaginated;
  labtestsQrystr: InertiaFormProps<LabtestsQrystr>;
  handlePaginate: (val: string) => void;
}

export default function LabtestsTable({ labtests, labtestsQrystr, handlePaginate }: LabtestsTableProps) {
  const columns = useLabtestsStore(state => state.columns);

  return (
    <>
      <div className="grow overflow-hidden bg-slate-50 dark:bg-slate-950">
        <ScrollArea className="h-full rounded-md border relative">
          <TableNowrap noWrapper>
            <TableHeader className="bg-fondo01 sticky top-0 z-10 hidden md:table-header-group">
              <TableRow className='hover:bg-fondo01'>
                {columns.filter(col => col.show).map((col) => (
                  <TableHead key={col.key} className="text-blue-100">
                    {col.sortable ? (
                      <LabtestsColumnSort
                        col={col}
                        labtestsQrystr={labtestsQrystr}
                      />
                    ) : (
                      <div className={cn(col.className)}>{col.label}</div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="text-[0.85rem]">
              {labtests.data && labtests.data.length ? (
                labtests.data.map((labtest) => (
                  <LabtestsTableRow
                    key={labtest.id}
                    labtest={labtest}
                  />
                ))
              ) : (
                <TableRow><TableCell colSpan={10} className="text-center">No hay registros para mostrar</TableCell></TableRow>
              )}
            </TableBody>
          </TableNowrap>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Pagination
        paginationData={labtests}
        handlePaginate={handlePaginate}
        per_page={labtestsQrystr.data.per_page || '50'}
      />
    </>
  )
}