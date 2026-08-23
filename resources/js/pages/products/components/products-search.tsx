import { Input } from '@/components/ui/input'
import { ProductsQrystr} from '@/types';
import { InertiaFormProps } from '@inertiajs/react';
import { ChangeEvent} from 'react'

type ProductSearchProps = {
  productsQrystr: InertiaFormProps<ProductsQrystr>;
}
export default function ProductSearch({ productsQrystr }: ProductSearchProps) {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    productsQrystr.setData({...productsQrystr.data, search: e.target.value, page: null});
  }

  return (
    <Input
      type='search'
      name='search'
      placeholder='Buscar'
      value={productsQrystr.data.search || ''}
      onChange={handleChange}
    />
  )
}
