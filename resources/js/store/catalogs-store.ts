import { Appearance } from '@/hooks/use-appearance';
import { AffectationType, Category, Unit } from '@/types';
import { create } from 'zustand';

type CatalogsState = {
  isDarkTheme: boolean;
  setIsDarkTheme: (appearance: string) => void
  // categories
  categories: Category[] | null;
  setCategories: (categories: Category[]) => void;
  // units
  units: Unit[] | null;
  setUnits: (units: Unit[]) => void
  // units
  affectationTypes: AffectationType[] | null;
  setAffectationTypes: (affectationTypes: AffectationType[]) => void
};


const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';
const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialState = {
  isDarkTheme: savedAppearance === 'dark' || (savedAppearance === 'system' && prefersDark()),
  categories: null,
  affectationTypes: null,
  units: null,
};

export const useCatalogsStore = create<CatalogsState>((set) => ({
  ...initialState,
  setIsDarkTheme: (appearance: string) => {
    const savedIsDark = appearance === 'dark' || (appearance === 'system' && prefersDark());
    set({ isDarkTheme: savedIsDark })
  },
  setCategories: (categories) => {
    set({categories})
  },
  setUnits: (units) => {
    set({units})
  },
  setAffectationTypes: (affectationTypes) => {
    set({affectationTypes})
  },
}));
