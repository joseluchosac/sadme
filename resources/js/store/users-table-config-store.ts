import { TableColumn } from '@/types';
import { create } from 'zustand';

type UsersTableState = {
  columns: TableColumn[];
  selectedRowId: number;
  setSelectedRowId: (value: number) => void;
};
const columnsInit = [
  { label: '',                  key: 'actions',     show: true,   sortable: false, className: '' },
  { label: 'USUARIO',           key: 'username',    show: true,   sortable: true, className: '' },
  { label: 'EMAIL',             key: 'email',       show: true,   sortable: true, className: '' },
  { label: 'NOMBRE',            key: 'name',        show: true,  sortable: true, className: '' },
  { label: 'EMAIL VERIFICADO',  key: 'email_verified_at', show: false,   sortable: true, className: '' },
  { label: 'ROLES',             key: 'roles',       show: true,   sortable: false, className: '' },
  { label: 'CREADO',            key: 'created_at',  show: true,   sortable: true, className: '' },
  { label: 'ACTUALIZADO',       key: 'updated_at',  show: true,  sortable: true, className: '' },
];

const initialState = {
  columns: columnsInit,
  selectedRowId: 0,
};

export const useUsersTableConfigStore = create<UsersTableState>((set) => ({
  ...initialState,
  setSelectedRowId: (value: number) => set({ selectedRowId: value }),
}));
