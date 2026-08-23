import { TableCell, TableRow } from "@/components/ui/custom/table-nowrap";
import { Product, ProductItem, TableColumn } from "@/types";
import { router } from "@inertiajs/react";
import { useAlertDialog } from "@/components/alert_dialog/use-alert-dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import MenuItem from "./menu-item";
import { useProductsStore } from "@/store/products-store";

interface ProductsTableRowProps {
  product: ProductItem;
}

export default function ProductsTableRow({ product }: ProductsTableRowProps) {
  const columns = useProductsStore(state => state.columns);
  const selectedRowId = useProductsStore(state => state.selectedRowId);
  const setSelectedRowId = useProductsStore(state => state.setSelectedRowId);

  const columnsShow = columns.filter(col => col?.show);

  const { confirm } = useAlertDialog();

  const setStatus = async (product: Product) => {
    const confirmed = await confirm({
      title: `Confirmar ${product.status == 1 ? 'desactivación' : 'activación'}`,
      message: `¿Desea ${product.status == 1 ? 'desactivar' : 'activar'} el producto "${product.name}"?`,
      confirmButtonText: `${product.status == 1 ? 'desactivar' : 'activar'}`,
      cancelButtonText: 'Cancelar',
    });
    if (!confirmed) return;
    router.patch(route('products.set-status', product.id?.toString()));
  }

  const destroyProduct = async (product: Product) => {
    const confirmed = await confirm({
      title: `Confirmar eliminación definitiva`,
      message: `¿Desea eliminar el producto "${product.name}" definitivamente?`,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!confirmed) return;
    router.delete(route('products.destroy', product.id?.toString()));
  }

  return (
    <>
      <TableRow
        key={product.id}
        className={`
          ${selectedRowId === product.id ? ' bg-green-400/25 hover:bg-green-400/25' : ''} hidden md:table-row
        `}
        onClick={e => {
          setSelectedRowId(product.id || 0);
        }}
      >
        {columnsShow.map((col) => (
          <Cell
            key={col.key}
            col={col}
            product={product}
            setStatus={setStatus}
            destroyProduct={destroyProduct}
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
                product={product}
                setStatus={setStatus}
                destroyProduct={destroyProduct}
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
  product: ProductItem;
  setStatus: (product: Product) => void;
  destroyProduct: (product: Product) => void;
}
function Cell({ col, product, setStatus, destroyProduct }: CellProps) {
  const setViewForm = useProductsStore(state => state.setViewForm);
  switch (col.key) {
    case 'actions': {
      return (
        <TableCell key={col.key}>
          <MenuItem
            product={product}
            setStatus={setStatus}
            destroyProduct={destroyProduct}
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
              setViewForm(product.id || null);
            }}
          >
            {product.code}
          </div>
        </TableCell>
      )
    }
    case 'status': {
      return (
        <TableCell key={col.key} className={cn(col.className)}>
          <Badge className={`${product.status == 0 ? 'bg-red-500, hover:bg-red-500' : 'hover:bg-blue-500 bg-blue-500'}`}>
            {product.status == 0 ? 'INACTIVO' : 'ACTIVO'}
          </Badge>
        </TableCell>
      )
    }
    default: {
      const value = product[col.key as keyof Product];
      return (
        <TableCell key={col.key} className={cn(col.className, `${product.status == 0 ? 'text-muted01' : ''}`)}>
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
  product: ProductItem;
  setStatus: (product: Product) => void;
  destroyProduct: (product: Product) => void;
}
function Item({ col, product, setStatus, destroyProduct }: ItemProps) {
  const setViewForm = useProductsStore(state => state.setViewForm);
  switch (col.key) {
    case 'actions': {
      return (
        <div key={col.key} className="col-span-12 flex  justify-end">
          <MenuItem
            product={product}
            setStatus={setStatus}
            destroyProduct={destroyProduct}
          />
        </div>
      )
    }
    case 'name': {
      return (
        <div key={col.key} className={cn('order-3 col-span-12 text-lg text-center')}>
            {product.name}
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
              setViewForm(product.id || null);
            }}
          >
            {product.code}
          </div>
        </div>
      )
    }
    case 'status': {
      return (
        <div key={col.key} className={cn('order-11 col-span-12 flex justify-center')}>
          <Badge className={`${product.status == 0 ? 'bg-red-500' : 'bg-blue-500'}`}>
            {product.status == 0 ? 'INACTIVO' : 'ACTIVO'}
          </Badge>
        </div>
      )
    }
    default: {
      const value = product[col.key as keyof Product];
      return (
        <div className="col-span-12 flex gap-3 jus order-10">
          <div className="text-muted01">{col.label}:</div>
          <div key={col.key} className={cn(`${product.status == 0 ? 'text-muted01' : ''}`)}>
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