import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProductsStore } from '@/store/products-store';
import { Product } from '@/types';
import { CircleCheck, CircleX, EllipsisVertical, Pencil, Trash } from 'lucide-react';
import { useState } from 'react'

interface MenuItemProps {
  product: Product;
  setStatus: (value: Product) => void;
  destroyProduct: (value: Product) => void;
}

export default function MenuItem({ product, setStatus, destroyProduct }: MenuItemProps) {
  const setView = useProductsStore(state => state.setView)
  const setProductId = useProductsStore(state => state.setProductId)
  
  const [openMenuItem, setOpenMenuItem] = useState(false)

  return (
    <DropdownMenu open={openMenuItem} onOpenChange={setOpenMenuItem}>
      <DropdownMenuTrigger asChild>
          <EllipsisVertical className='text-muted01 hover:text-primary cursor-pointer' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className='text-blue-500 focus:text-blue-400'
          title="Editar"
          onSelect={() => {
            setOpenMenuItem(false)
            setProductId(product.id);
            setView('form');
          }}
        >
          <Pencil /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`${product.status == 1 ? 'text-orange-500 focus:text-orange-500' : 'text-green-500 focus:text-green-500'}`}
          title="Activar/desactivar producto"
          onSelect={() => {
            setOpenMenuItem(false)
            setStatus(product);
          }}
        >
          {product.status == 1 ? (<><CircleX /> Desactivar</>) : (<><CircleCheck /> Activar</>)}
        </DropdownMenuItem>
        {!product.status && (
          <DropdownMenuItem
            className='text-red-500 focus:text-red-500'
            title="Eliminar"
            onSelect={() => {
              setOpenMenuItem(false)
              destroyProduct(product);
            }}
          >
            <Trash /> Eliminar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
