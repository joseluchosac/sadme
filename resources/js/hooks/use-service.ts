import axios from "axios";
import { useState } from "react"


export default function useService<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProduct = async (id: number) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('products.get', id));
      if (resp.data) {
        setData(resp.data);
      } else {
        setError(resp.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      // setError(err || 'Error en la solicitud');
      setError(err || 'Error al obtener el producto');
    } finally {
      setIsLoading(false);
    }
  }

  const getCategories = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('categories.get-all'));
      if (resp.data) {
        setData(resp.data);
      } else {
        setError(resp.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      // setError(err || 'Error en la solicitud');
      setError(err || 'Error al obtener las categorías');
    } finally {
      setIsLoading(false);
    }
  }

  const getUnits = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('catalogs.get-units'));
      if (resp.data) {
        setData(resp.data);
      } else {
        setError(resp.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      // setError(err || 'Error en la solicitud');
      setError(err || 'Error al obtener unidades');
    } finally {
      setIsLoading(false);
    }
  }
  const getAffectationTypes = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('catalogs.get-affectation-types'));
      if (resp.data) {
        setData(resp.data);
      } else {
        setError(resp.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      // setError(err || 'Error en la solicitud');
      setError(err || 'Error al obtener unidades');
    } finally {
      setIsLoading(false);
    }
  }


  const reset = () => {
    setData(null)
  }
  
  return {
    data,
    isLoading,
    error,
    getProduct,
    getCategories,
    getUnits,
    getAffectationTypes,
    reset
  };
}
