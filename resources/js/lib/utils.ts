import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Función debounce genérica
export function debounce<F extends (...args: any[]) => void>(fn: F, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Quita los elementos de un objeto que son vacíos o nulos
export function limpiarObjeto<T extends Record<string, any>>(obj: T): Partial<T> {
    const resultado: Partial<T> = {};
    for (const [key, value] of Object.entries(obj)) {
      // se cambia el value a string para que funcione el trim()
      const valueStr = (value == undefined) ? '' : (typeof value == 'number') ? value.toString() : value
        if (valueStr !== null && valueStr.trim() !== '' && valueStr !== undefined) {
            (resultado as any)[key] = value;
        }
    }
    return resultado;
}

// Concaten array de strings, ejem: concatenarArray(['hola', 'jose'], ' - ') devuelve 'hola - jose'
export function concatenarArray(arr: string[], separator: string = ' '): string {
  return arr.filter(item => item !== null && item !== undefined && item.trim() !== '').join(separator);
}



// Devuelve el rango entre el primer día y el último día del mes pasado
export function getLastMonthRange(): { firstDay: Date; lastDay: Date } {
  // Tomamos la fecha actual
  const today = new Date();

  // Retrocedemos un mes
  const lastMonth = subMonths(today, 1);

  // Obtenemos el primer día del mes pasado
  const firstDay = startOfMonth(lastMonth);

  // Obtenemos el último día del mes pasado
  const lastDay = endOfMonth(lastMonth);

  return { firstDay, lastDay };
}