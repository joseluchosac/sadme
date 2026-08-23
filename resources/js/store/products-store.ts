import { TableColumn } from '@/types';
import { CheckedState } from '@radix-ui/react-checkbox';
import { create } from 'zustand';

type ProductsState = {
  columns: TableColumn[];
  selectedRowId: number;
  setSelectedRowId: (value: number) => void;
  setShow: (show: CheckedState, key: string) => void;
  view: string; // 'form', 'table'
  setView: (view: string) => void;
  setViewTable: () => void;
  setViewForm: (productId?: number | null) => void;
  productId: number | null;
  setProductId: (productId: number | null) => void;
};

const columnsInit = [
  { label: '', key: 'actions', show: true, sortable: false },
  { label: 'ID', key: 'id', show: false, sortable: true },
  { label: 'COD', key: 'code', show: true, sortable: true,},
  { label: 'NOMBRE', key: 'name', show: true, sortable: true, className: '' },
  { label: 'COD UNIDAD', key: 'unit_code', show: false, sortable: false },
  { label: 'UNIDAD', key: 'unit_name', show: false, sortable: false },
  { label: 'PRECIO', key: 'price', show: true, sortable: true},
  { label: 'MIN STOCK', key: 'min_stock', show: false, sortable: true },
  { label: 'MARCA', key: 'brand', show: false, sortable: true },
  { label: 'COD BARRAS', key: 'barcode', show: false, sortable: true },
  { label: 'TIPO_ID', key: 'product_type_id', show: false, sortable: true },
  { label: 'TIPO', key: 'product_type_name', show: true, sortable: true },
  { label: 'ESTADO', key: 'status', show: true, sortable: true },
  { label: 'CREADO', key: 'created_at', show: false, sortable: true },
  { label: 'ACTUALIZADO', key: 'updated_at', show: false, sortable: true },
];

const initialState = {
  columns: columnsInit,
  selectedRowId: 0,
  view: 'table',
  productId: null,
};

export const useProductsStore = create<ProductsState>((set, get) => ({
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
  setViewForm: (productId) => {
    set({view: 'form', productId});
  },
  setProductId: (productId) => {
    set({productId});
  },
}));
