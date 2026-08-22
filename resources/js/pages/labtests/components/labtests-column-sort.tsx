import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { LabtestsQrystr, TableColumn } from '@/types';
import { InertiaFormProps } from '@inertiajs/react';
import { ArrowBigDown, ArrowBigUp, CircleX } from 'lucide-react';
import { useState } from 'react'

type Props = {
  col: TableColumn;
  labtestsQrystr: InertiaFormProps<LabtestsQrystr>;
}

export default function LabtestsColumnSort({ col, labtestsQrystr }: Props) {
  const [openColSort, setOpenColSort] = useState(false)

  const currentSortField = labtestsQrystr.data.sortby?.split('-')[0];
  const currentSortOrder = labtestsQrystr.data.sortby?.split('-')[1] ?? 'asc';

  const handleSort = (order: 'asc' | 'desc' | null) => {
    if (labtestsQrystr.data.sortby) {
      if (currentSortField === col.key) {
        if (currentSortOrder === order) return;
      } else {
        if (currentSortOrder && !order) return;
      }
    }

    const sortby = order ? col.key + '-' + order : null;
    labtestsQrystr.setData({ ...labtestsQrystr.data, sortby, page: '1' });
  }

  return (
    <DropdownMenu open={openColSort} onOpenChange={setOpenColSort}>
      <DropdownMenuTrigger asChild>
        <div className={cn(col.className, 'cursor-pointer')} >
          <span>{col.label}</span>
          {(currentSortField === col.key) && (
            currentSortOrder === 'desc' ? <ArrowBigDown className='text-yellow-400 inline' /> : <ArrowBigUp className='text-yellow-400 inline' />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => handleSort('asc')}>
          <ArrowBigUp /> Ascendente
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleSort('desc')}>
          <ArrowBigDown /> Descendente
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleSort(null)}>
          <CircleX />Sin ordenar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
