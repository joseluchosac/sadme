import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce';
import { ProductsQrystr } from '@/types';
import { InertiaFormProps } from '@inertiajs/react';
import { ChangeEvent, useEffect, useState } from 'react'

type ProductSearchProps = {
  productsQrystr: InertiaFormProps<ProductsQrystr>;
}
const SEARCH_DEBOUNCE_MS = 400;

export default function ProductSearch({ productsQrystr }: ProductSearchProps) {
  const [search, setSearch] = useState(productsQrystr.data.search || '');
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  // sincroniza el input cuando la busqueda cambia externamente (ej. reset)
  useEffect(() => {
    setSearch(productsQrystr.data.search || '');
  }, [productsQrystr.data.search]);

  // actualiza qrystr una sola vez cuando termina el debounce
  useEffect(() => {
    if (debouncedSearch === (productsQrystr.data.search || '')) return;
    productsQrystr.setData({ ...productsQrystr.data, search: debouncedSearch, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  return (
    <Input
      type='search'
      name='search'
      placeholder='Buscar'
      value={search}
      onChange={handleChange}
    />
  )
}
