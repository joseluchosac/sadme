import axios from "axios";
import { useState } from "react"


export default function useUserService<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUser = async (id: number) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('admin.users.get', id));
      if (resp.data.success) {
        setData(resp.data.user);
      } else {
        setError(resp.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  }

  const patchUser = async (params: any) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.patch(route('users.patch', params.id), params);
      if (resp.data.success) {
        setData(resp.data.User);
      } else {
        setError(resp.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  }

  const resetData = () => {
    setData(null)
  }
  
  return {
    data,
    isLoading,
    error,
    getUser,
    patchUser,
    resetData
  };
}
