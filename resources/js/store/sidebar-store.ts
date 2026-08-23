import { MainNavItem } from '@/types';
import { House, Package, Settings, ShieldX } from 'lucide-react';
import { create } from 'zustand';

type SidebarState = {
  mainNavItems: MainNavItem[];
  setMainNavItems: (value: MainNavItem[]) => void;
};

const mainNavItemsInit: MainNavItem[] = [
  // INICIO
  {
    title: 'Inicio',
    url: '/dashboard',
    rootUrl: '/dashboard',
    icon: House,
    isActive: true,
    isOpen: false,
    can: null,
    subItems: null,
  },
  // PRODUCTS
  {
    title: 'Productos',
    url: '/',
    rootUrl: '/',
    icon: Package,
    isActive: false,
    isOpen: false,
    can: null,
    subItems:[
      {
        title: 'Productos',
        url: '/products',
        can: null,
      }
    ]
  },
  // ADMINISTRACION
  {
    title: 'Administración',
    url: '/',
    rootUrl: '/',
    icon: ShieldX,
    isActive: false,
    isOpen: false,
    can: [],
    subItems: [
      {
        title: 'Usuarios',
        url: '/admin/users',
        can: ['read-users'],
      },
      {
        title: 'Roles',
        url: '/admin/roles',
        can: ['read-roles'],
      },
      {
        title: 'Permisos',
        url: '/admin/permissions',
        can: ['read-permissions'],
      },
    ]
  },
  // CONFIGURACION
  {
    title: 'Configuración',
    url: '/',
    rootUrl: '/',
    icon: Settings,
    isActive: false,
    isOpen: false,
    can: null,
    subItems: [
      {
        title: 'Empresa',
        url: '/settings/company-settings',
        can: ['read-company_settings'],
      },
    ]
  },
];

const initialState = {
  mainNavItems: mainNavItemsInit,
};

export const useSidebarStore = create<SidebarState>((set) => ({
  ...initialState,
  setMainNavItems: (value) => set({ mainNavItems: value }),
}));
