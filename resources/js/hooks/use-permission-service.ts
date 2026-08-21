import axios from "axios";
import { useState } from "react"


export default function usePermissionService<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPermission = async (id: number) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('admin.permissions.get', id));
      if (resp.data.success) {
        setData(resp.data.permission);
      } else {
        setError(resp.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  }

  const getAllPermissions = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('admin.permissions.get-all'));
      if (resp.data) {
        setData(resp.data);
      } else {
        setError(resp?.data?.message || 'Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  }

  const patchPermission = async (params: any) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.patch(route('permissions.patch', params.id), params);
      if (resp.data.success) {
        setData(resp.data.Permission);
      } else {
        setError(resp.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    data,
    isLoading,
    error,
    getPermission,
    getAllPermissions,
    patchPermission,
  };
}
