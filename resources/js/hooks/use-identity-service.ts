import axios from "axios";
import { useState } from "react"

export default function useIdentityService<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupIdentity = async (identity_code: string, identity_number: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    if (!identity_number) {
      setError('El número de documento es requerido');
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(route('services.lookup-identity', [identity_code, identity_number]));
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const consultarReniec = async (numero: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    if (!numero) {
      setError('El número de DNI es requerido');
      setIsLoading(false);
      return;
    }
    if (numero.length !== 8) {
      setError('El número de DNI debe tener 8 dígitos');
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post('/services/consultar-dni', {
        numero,
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setData(null);
  }

  return {
    data,
    isLoading,
    error,
    lookupIdentity,
    consultarReniec,
    reset
  };
}
