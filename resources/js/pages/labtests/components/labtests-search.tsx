import { Input } from '@/components/ui/input'
import { LabtestsQrystr} from '@/types';
import { InertiaFormProps } from '@inertiajs/react';
import { ChangeEvent} from 'react'

type LabtestSearchProps = {
  labtestsQrystr: InertiaFormProps<LabtestsQrystr>;
}
export default function LabtestSearch({ labtestsQrystr }: LabtestSearchProps) {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    labtestsQrystr.setData({...labtestsQrystr.data, search: e.target.value, page: null});
  }

  return (
    <Input
      type='search'
      name='search'
      placeholder='Buscar'
      value={labtestsQrystr.data.search || ''}
      onChange={handleChange}
    />
  )
}
