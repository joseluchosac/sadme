import { useState, useEffect, useRef, useCallback } from "react";

// useDebounce: Devuelve el valor del argumento despues de un tiempo indicado
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // limpiar el timeout si el valor cambia antes de que termine el delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// useDebounceCallback, Ejecuta una funcion después de un tiempo indicado
export function useDebounceCallback<T extends (...args: any[]) => any>(callback: T, delay: number) {
    // Cambiamos el tipo aquí 👇
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const debouncedFunction = useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    return debouncedFunction;
}