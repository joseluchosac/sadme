import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLabtestsStore } from '@/store/labtests-store';
import { Labtest } from '@/types';
import { CircleCheck, CircleX, EllipsisVertical, Pencil, Trash } from 'lucide-react';
import { useState } from 'react'

interface MenuItemProps {
  labtest: Labtest;
  setStatus: (value: Labtest) => void;
  destroyLabtest: (value: Labtest) => void;
}

export default function MenuItem({ labtest, setStatus, destroyLabtest }: MenuItemProps) {
  const setView = useLabtestsStore(state => state.setView)
  const setLabtestId = useLabtestsStore(state => state.setLabtestId)
  
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
            setLabtestId(labtest.id);
            setView('form');
          }}
        >
          <Pencil /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`${labtest.status == 1 ? 'text-orange-500 focus:text-orange-500' : 'text-green-500 focus:text-green-500'}`}
          title="Activar/desactivar labtesto"
          onSelect={() => {
            setOpenMenuItem(false)
            setStatus(labtest);
          }}
        >
          {labtest.status == 1 ? (<><CircleX /> Desactivar</>) : (<><CircleCheck /> Activar</>)}
        </DropdownMenuItem>
        {!labtest.status && (
          <DropdownMenuItem
            className='text-red-500 focus:text-red-500'
            title="Eliminar"
            onSelect={() => {
              setOpenMenuItem(false)
              destroyLabtest(labtest);
            }}
          >
            <Trash /> Eliminar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
