import { TableColumn } from '@/types';
import { CheckedState } from '@radix-ui/react-checkbox';
import { create } from 'zustand';

type LabtestsState = {
  columns: TableColumn[];
  selectedRowId: number;
  setSelectedRowId: (value: number) => void;
  setShow: (show: CheckedState, key: string) => void;
  view: string; // 'form', 'table'
  setView: (view: string) => void;
  setViewTable: () => void;
  setViewForm: (labtestId?: number | null) => void;
  labtestId: number | null;
  setLabtestId: (labtestId: number | null) => void;
};

const columnsInit = [
  { label: '', key: 'actions', show: true, sortable: false },
  { label: 'ID', key: 'id', show: false, sortable: true },
  { label: 'COD', key: 'code', show: true, sortable: true,},
  { label: 'EXAMEN', key: 'name', show: true, sortable: true, className: '' },
  { label: 'AREA', key: 'area', show: true, sortable: false },
  { label: 'MUESTRA', key: 'sample', show: true, sortable: true},
  { label: 'ESTADO', key: 'status', show: true, sortable: true },
  { label: 'CREADO', key: 'created_at', show: false, sortable: true },
  { label: 'ACTUALIZADO', key: 'updated_at', show: false, sortable: true },
];

const initialState = {
  columns: columnsInit,
  selectedRowId: 0,
  view: 'table',
  labtestId: null,
};

export const useLabtestsStore = create<LabtestsState>((set, get) => ({
  ...initialState,
  setSelectedRowId: (value: number) => set({ selectedRowId: value }),
  setShow: (show: CheckedState, key: string) => {
    const newColumns = get().columns.map(el => {
      if (el.key !== key) return el
      el.show = show as boolean;
      return el
    });
    set({ columns: newColumns })
  },
  setView: (view) => {
    set({view});
  },
  setViewTable: () => {
    set({view: 'table'});
  },
  setViewForm: (labtestId) => {
    set({view: 'form', labtestId});
  },
  setLabtestId: (labtestId) => {
    set({labtestId});
  },
}));
