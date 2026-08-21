import { useAlertDialogContext } from "./use-alert-dialog-context";
type Confirm = {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  withPassword?: boolean;
};
export function useAlertDialog() {
  const { showAlert } = useAlertDialogContext();

  const confirm = async ({
    title = '¿Estás seguro?',
    message,
    confirmButtonText = "Sí, continuar",
    cancelButtonText = "Cancelar",
  }: Confirm): Promise<boolean> => {
    return await showAlert({
      title,
      message,
      confirmButtonText,
      cancelButtonText,
    });
  };
  const confirmPassword = async ({
    title = '¿Estás seguro?',
    message,
    confirmButtonText = "Confirmar",
    cancelButtonText = "Cancelar",
    withPassword = true
  }: Confirm): Promise<boolean> => {
    return await showAlert({
      title,
      message,
      confirmButtonText,
      cancelButtonText,
      withPassword
    });
  };

  const warning = async ({
    title = 'Advertencia',
    message,
    confirmButtonText = "Entiendo",
    cancelButtonText = "Cancelar",
  }: Confirm): Promise<boolean> => {
    return await showAlert({
      title,
      message,
      confirmButtonText,
      cancelButtonText,
    });
  };

  const success = async ({
    title = 'Éxito',
    message,
    confirmButtonText = "Aceptar"
  }: Confirm): Promise<boolean> => {
    return await showAlert({
      title,
      message,
      confirmButtonText,
      cancelButtonText: undefined, // No mostrar botón de cancelar
    });
  };

  const error = async ({
    title = 'Error',
    message,
    confirmButtonText = "Aceptar"
  }: Confirm): Promise<boolean> => {
    return await showAlert({
      title,
      message,
      confirmButtonText,
      cancelButtonText: undefined,
    });
  };

  return {
    confirm,
    confirmPassword,
    success,
    error,
    warning,
    show: showAlert, // Para casos personalizados
  };
}
