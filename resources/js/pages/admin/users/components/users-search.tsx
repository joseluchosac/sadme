import { Input } from '@/components/ui/input'
import { Qrystr } from '@/types';
import { InertiaFormProps } from '@inertiajs/react';
import { ChangeEvent } from 'react'

type UsersSearchProps = {
  usersQrystr: InertiaFormProps<Qrystr>;
}
export default function UsersSearch({ usersQrystr }: UsersSearchProps) {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    usersQrystr.setData({...usersQrystr.data, search: e.target.value, page: null});
  }

  return (
    <Input
      // className='w-1/3'
      type='search'
      name='search'
      placeholder='Buscar usuario'
      value={usersQrystr.data.search || ''}
      onChange={handleChange}
    />
  )
}
