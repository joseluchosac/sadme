
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
// import { toast } from 'sonner';
// import { useMutationUsersQuery } from '@/api/queries/useUsersQuery';
// import type { ApiResp, MsgType } from '@/app/types';
// import { LoaderBarAbsolute } from '../Loaders';

interface AlertDialogOptions {
  title?: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  withPassword?: boolean;
}

interface AlertDialogContextType {
  showAlert: (options: AlertDialogOptions) => Promise<boolean>;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export function AlertDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertDialogOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);
  const [password, setPassword] = useState<string>('');

  // const {
  //   data: checkPasswordResp,
  //   isPending,
  //   checkPassword
  // } = useMutationUsersQuery<ApiResp>()
  
  const showAlert = useCallback((alertDialogOptions: AlertDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(alertDialogOptions);
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = async () => {
    // if(options?.withPassword) {
    //   if(password.trim() === ''){
    //     toast.warning('Por favor, ingresa la contraseña.');
    //   }else{
    //     checkPassword(password)
    //   }
    //   return;
    // }
    setIsOpen(false);
    resolvePromise?.(true);
    setResolvePromise(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(false);
    setResolvePromise(null);
  };

  useEffect(() => {
    setPassword('');
  },[isOpen])

  // useEffect(() => {
  //   if(!checkPasswordResp) return
  //   if(checkPasswordResp.error){
  //     toast[checkPasswordResp?.msgType as MsgType](checkPasswordResp?.msg)
  //   }else{
  //     setIsOpen(false);
  //     resolvePromise?.(true);
  //     setResolvePromise(null);
  //   }
  // },[checkPasswordResp])

  return (
    <AlertDialogContext.Provider value={{ showAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className='overflow-hidden'>
          <AlertDialogHeader>
            <AlertDialogTitle>{options?.title || 'Confirmación'}</AlertDialogTitle>
            <AlertDialogDescription>
              {options?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {/* {isPending && <LoaderBarAbsolute />} */}
          {options?.withPassword &&
            <Input
              type='password' 
              placeholder='contraseña' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          }
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {options?.cancelButtonText || 'Cancelar'}
            </AlertDialogCancel>
            {options?.withPassword
              ? <Button onClick={handleConfirm}>{options?.confirmButtonText || 'Aceptar'}</Button>
              : <AlertDialogAction onClick={handleConfirm}>
                  {options?.confirmButtonText || 'Aceptar'}
                </AlertDialogAction>
            }
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}

export const useAlertDialogContext = () => {
  const context = useContext(AlertDialogContext);
  if (context === undefined) {
    throw new Error('useAlertDialog must be used within an AlertDialogProvider');
  }
  return context;
};