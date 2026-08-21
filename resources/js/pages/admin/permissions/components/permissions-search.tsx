import { Input } from '@/components/ui/input'
import { Qrystr } from '@/types';
import { InertiaFormProps } from '@inertiajs/react';
import { ChangeEvent } from 'react'

type PermissionsSearchProps = {
  permissionsQrystr: InertiaFormProps<Qrystr>;
}
export default function PermissionsSearch({ permissionsQrystr }: PermissionsSearchProps) {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    permissionsQrystr.setData({...permissionsQrystr.data, search: e.target.value, page: null});
  }

  return (
    <Input
      // className='w-1/3'
      type='search'
      name='search'
      placeholder='Buscar permiso'
      value={permissionsQrystr.data.search || ''}
      onChange={handleChange}
    />
  )
}
