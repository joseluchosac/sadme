import { Appearance } from '@/hooks/use-appearance';
import { Identity } from '@/types';
import { create } from 'zustand';

type CatalogsState = {
  identities: Identity[];
  isDarkTheme: boolean;
  setIsDarkTheme: (appearance: string) => void
};
const identitiesInit: Identity[] = [
  {id:1, code: '00', name:'Sin documento', long_name: 'Sin documento', status:1, long: 15},
  {id:2, code: '01', name:'DNI', long_name: 'Documento Nacional de Identidad', status:1, long: 8},
  {id:3, code: '04', name:'CE', long_name: 'Carnet de Extranjería', status:1, long: 12},
  {id:4, code: '06', name:'RUC', long_name: 'Registro Unico de Contribuyentes', status:1, long: 11},
  {id:5, code: '07', name:'PPTE', long_name: 'Pasaporte', status:1, long: 12},
];

const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';
const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialState = {
  identities: identitiesInit,
  isDarkTheme: savedAppearance === 'dark' || (savedAppearance === 'system' && prefersDark())
};

export const useCatalogsStore = create<CatalogsState>((set) => ({
  ...initialState,
  setIsDarkTheme: (appearance: string) => {
    const savedIsDark = appearance === 'dark' || (appearance === 'system' && prefersDark());
    set({ isDarkTheme: savedIsDark })
  }
}));
