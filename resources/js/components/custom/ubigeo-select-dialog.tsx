import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FieldSet } from '@/components/ui/field';
import { UbigeoData } from '@/types';
import { useEffect, useState } from 'react';
import useUbigeoService from '@/hooks/use-ubigeo-service';
import { Label } from '../ui/label';
import { NativeSelect, NativeSelectOption } from '../ui/native-select';
import { Spinner } from '../ui/spinner';
import { Button } from '../ui/button';
import { toast } from 'sonner';


type OptionDepartamento = {
  depa_cod: string;
  departamento: string;
}
type OptionProvincia = {
  prov_cod: string;
  provincia: string;
}

interface UbigeosSelectDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onChoose: (ubigeo: UbigeoData ) => void;
}
export function UbigeosSelectDialog({ open, setOpen, onChoose }: UbigeosSelectDialogProps) {
  const { getUbigeoDepartamentos, data: dataDepartamentos, isLoading: loadDepartamentos } = useUbigeoService<OptionDepartamento[]>();
  const { getUbigeoProvincias, data: dataProvincias, reset: resetProvincias, isLoading: loadProvincias } = useUbigeoService<OptionProvincia[]>();
  const { getUbigeoDistritos, data: dataDistritos, reset: resetDistritos, isLoading: loadDistritos } = useUbigeoService<UbigeoData[]>();
  const [ubigeo, setUbigeo] = useState<UbigeoData | null>(null);

  const changeDepartamento = (value: string) => {
    resetDistritos();
    setUbigeo(null);
    if(value){
      getUbigeoProvincias(value);
    }else{
      resetProvincias();
    }
  }
  const changeProvincia = (value: string) => {
    setUbigeo(null);
    if(value){
      getUbigeoDistritos(value);
    }else{
      resetDistritos();
    }
  }

  const changeDistrito = (value: string) => {
    const selectedUbigeo = dataDistritos?.find(el=>el.code_inei == value);
    setUbigeo(selectedUbigeo || null);
  }

  useEffect(() => {
    getUbigeoDepartamentos();
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={open => { 
        if(!open){
          setUbigeo(null);
          resetDistritos();
          resetProvincias();
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>{/* <Button variant="outline" title="Filtros"><Filter /></Button> */}</DialogTrigger>
      <DialogContent className="max-w-[350px] sm:max-w-sm p-3">
        <DialogHeader>
          <DialogTitle>Seleccionar ubicación</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <FieldSet className="flex flex-col gap-2">
          <div className='flex gap-3'>
            <Label>Departamento</Label>
            {loadDepartamentos && <Spinner />}
          </div>
          <NativeSelect
            disabled={loadDepartamentos}
            className='w-full dark:[color-scheme:dark]'
            onChange={(e)=>changeDepartamento(e.currentTarget.value)}
          >
            <NativeSelectOption value=''>- Seleccione -</NativeSelectOption>
            {dataDepartamentos && dataDepartamentos.map(el => (
              <NativeSelectOption key={el.depa_cod} value={el.depa_cod}>{el.departamento}</NativeSelectOption>
            ))}
          </NativeSelect>
        </FieldSet>
        <FieldSet className="flex flex-col gap-2">
          <div className='flex gap-3'>
            <Label>Provincia</Label>
            {loadProvincias && <Spinner />}
          </div>
          <NativeSelect
            className='w-full dark:[color-scheme:dark]'
            disabled={loadProvincias}
            onChange={(e)=>changeProvincia(e.currentTarget.value)}
          >
            <NativeSelectOption value=''>- Seleccione -</NativeSelectOption>
            {dataProvincias && dataProvincias.map(el => (
              <NativeSelectOption key={el.prov_cod} value={el.prov_cod}>{el.provincia}</NativeSelectOption>
            ))}
          </NativeSelect>
        </FieldSet>
        <FieldSet className="flex flex-col gap-2">
          <div className='flex gap-3'>
            <Label>Distrito</Label>
            {loadDistritos && <Spinner />}
          </div>
          <NativeSelect
            className='w-full dark:[color-scheme:dark]'
            disabled={loadDistritos}
            onChange={(e)=>changeDistrito(e.currentTarget.value)}
          >
            <NativeSelectOption value=''>- Seleccione -</NativeSelectOption>
            {dataDistritos && dataDistritos.map(el => (
              <NativeSelectOption key={el.code_inei} value={el.code_inei}>{el.distrito}</NativeSelectOption>
            ))}
          </NativeSelect>
        </FieldSet>
        <div className='text-center'>
          <Button
            onClick={() => {
              if(ubigeo){
                onChoose(ubigeo)
              }else{
                toast.warning('Elija todas las opciones')
              }

            }}
          >Aceptar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
