import { TableBody, TableCell, TableHead, TableHeader, TableNowrap, TableRow } from "@/components/ui/custom/table-nowrap";
import { ProductsPaginated, ProductsQrystr } from "@/types";
import { InertiaFormProps } from "@inertiajs/react";
import ProductsColumnSort from "./products-column-sort";
import ProductsTableRow from "./products-table-row";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Pagination } from "@/components/ui/custom/pagination";
import { useProductsStore } from "@/store/products-store";

interface ProductsTableProps {
  products: ProductsPaginated;
  productsQrystr: InertiaFormProps<ProductsQrystr>;
  handlePaginate: (val: string) => void;
}

export default function ProductsTable({ products, productsQrystr, handlePaginate }: ProductsTableProps) {
  const columns = useProductsStore(state => state.columns);

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
                      <ProductsColumnSort
                        col={col}
                        productsQrystr={productsQrystr}
                      />
                    ) : (
                      <div className={cn(col.className)}>{col.label}</div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="text-[0.85rem]">
              {products.data && products.data.length ? (
                products.data.map((product) => (
                  <ProductsTableRow
                    key={product.id}
                    product={product}
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
        paginationData={products}
        handlePaginate={handlePaginate}
        per_page={productsQrystr.data.per_page || '250'}
      />
    </>
  )
}