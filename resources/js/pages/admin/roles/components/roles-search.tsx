import { Input } from '@/components/ui/input'
import { Qrystr } from '@/types';
import { InertiaFormProps } from '@inertiajs/react';
import { ChangeEvent } from 'react'

type RolesSearchProps = {
  rolesQrystr: InertiaFormProps<Qrystr>;
}
export default function RolesSearch({ rolesQrystr }: RolesSearchProps) {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    rolesQrystr.setData({...rolesQrystr.data, search: e.target.value, page: null});
  }

  return (
    <Input
      // className='w-1/3'
      type='search'
      name='search'
      placeholder='Buscar rol'
      value={rolesQrystr.data.search || ''}
      onChange={handleChange}
    />
  )
}
