import { TableColumn } from '@/types';
import { create } from 'zustand';

type RolesState = {
  columns: TableColumn[];
  selectedRowId: number;
  setSelectedRowId: (value: number) => void;
};
const columnsInit = [
  { label: '',                  key: 'actions',     show: true,  sortable: false, className: '' },
  { label: 'ROL',               key: 'name',        show: true,  sortable: true, className: '' },
  { label: 'PERMISOS',          key: 'permissions', show: true,  sortable: true, className: '' },
  { label: 'NOMBRE DE RESERVA', key: 'guard_name',  show: false, sortable: true, className: '' },
  { label: 'CREADO',            key: 'created_at',  show: true,  sortable: true, className: '' },
  { label: 'ACTUALIZADO',       key: 'updated_at',  show: true,  sortable: true, className: '' },
];

const initialState = {
  columns: columnsInit,
  selectedRowId: 0,
};

export const useRolesStore = create<RolesState>((set) => ({
  ...initialState,
  setSelectedRowId: (value: number) => set({ selectedRowId: value }),
}));
