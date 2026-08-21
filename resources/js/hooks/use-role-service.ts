import axios from "axios";
import { useState } from "react"


export default function useRoleService<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRole = async (id: number) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('admin.roles.get', id));
      if (resp.data.success) {
        setData(resp.data.role);
      } else {
        setError(resp.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setIsLoading(false);
    }
  }

  const getAllRoles = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.get(route('admin.roles.get-all'));
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

  const patchRole = async (params: any) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const resp = await axios.patch(route('roles.patch', params.id), params);
      if (resp.data.success) {
        setData(resp.data.Role);
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
    getRole,
    getAllRoles,
    patchRole,
  };
}
