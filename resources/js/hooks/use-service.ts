import axios from "axios";
import { useState } from "react"


export default function useService<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLabtest = async (id: number) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('labtests.get', id));
      if (resp.data) {
        setData(resp.data);
      } else {
        setError(resp.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      // setError(err || 'Error en la solicitud');
      setError(err || 'Error al obtener el examen de laboratorio');
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
    getLabtest,
    reset
  };
}
