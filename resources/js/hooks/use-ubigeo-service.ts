import axios from "axios";
import { useState } from "react"


export default function useUbigeoService<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUbigeoDepartamentos = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('ubigeos.get-departamentos'));
      if (resp.data) {
        setData(resp.data);
      } else {
        setError('Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  }

  const getUbigeoProvincias = async (depa_cod: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('ubigeos.get-provincias', [depa_cod]));
      if (resp.data) {
        setData(resp.data);
      } else {
        setError('Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  }

  const getUbigeoDistritos = async (prov_cod: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('ubigeos.get-distritos', [prov_cod]));
      if (resp.data) {
        setData(resp.data);
      } else {
        setError('Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  }

  const reset = () => {
    setData(null);
  }

  return {
    data,
    isLoading,
    error,
    getUbigeoDepartamentos,
    getUbigeoProvincias,
    getUbigeoDistritos,
    reset,
  };
}
