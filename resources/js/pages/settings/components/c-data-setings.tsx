import { UbigeosSelectDialog } from "@/components/custom/ubigeo-select-dialog";
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group";
import { TableBody, TableCell, TableNowrap, TableRow } from "@/components/ui/custom/table-nowrap"
import { Input } from "@/components/ui/input"
import { CompanySetting, UbigeoData } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { ListIcon } from "lucide-react";
import { useState } from "react";

type EmpresaForm = {
  items: CompanySetting[]
}

interface CDataSettingsProps {
  companySettings: CompanySetting[]
}
export default function CDataSettings({ companySettings }: CDataSettingsProps) {
  const [openUbigeosSelectDialog, setOpenUbigeosSelectDialog] = useState(false);
  const empresaform = useForm<EmpresaForm>({
    items: companySettings.filter(el => el.seccion == '100' && el.ordinal != 0)
  });

  const change = (valor: string, item: CompanySetting) => {
    const itemChanged = { ...item, valor };
    const newItems = empresaform.data.items.map(el => {
      return el.id === itemChanged.id ? itemChanged : el;
    });
    empresaform.setData('items', newItems);
  }

  const onChooseUbigeo = (ubigeo: UbigeoData) => {
    const newItems = empresaform.data.items.map(el => {
      if(el.campo == 'ubigeo'){
        return {...el, valor: ubigeo.ubigeo_ipd}
      }else if (el.campo == 'ubigeo_code') {
        return {...el, valor: ubigeo.code_inei}
      }else{
        return el
      }
    });
    empresaform.setData('items', newItems);
    setOpenUbigeosSelectDialog(false);
  }

  const submit = () => {
    empresaform.put(route('settings.company-settings.update'), {
      onSuccess: () => {
        router.flushAll();
      }
    })
  }

  return (
    <>
      <div className='px-4'>
        <TableNowrap>
          <TableBody>
            {empresaform.data.items.map(el => {
              switch (el.campo) {
                case 'ubigeo': {
                  return (
                    <TableRow key={el.id}>
                      <TableCell>{el.campo_desc}</TableCell>
                      <TableCell>
                        <ButtonGroup className='w-full'>
                          <Input
                            id='ubigeo_code'
                            type='text'
                            name='ubigeo_code'
                            readOnly
                            value={el.valor}
                          />
                          <Button
                            type='button'
                            variant="outline"
                            aria-label="Search"
                          onClick={() => setOpenUbigeosSelectDialog(true)}
                          >
                            <ListIcon />
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  )
                }
                default: {
                  return (
                    <TableRow key={el.id}>
                      <TableCell>{el.campo_desc}</TableCell>
                      <TableCell>
                        <Input
                          value={el.valor}
                          onChange={e => {
                            change(e.target.value, el)
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                }
              }
            })}
          </TableBody>
        </TableNowrap>
      </div>
      <div className='text-center my-4'>
        <Button
          onClick={submit}
        >
          Guardar configuraciones
        </Button>
      </div>
      <UbigeosSelectDialog
        open={openUbigeosSelectDialog}
        setOpen={setOpenUbigeosSelectDialog}
        onChoose={onChooseUbigeo}
      />
    </>
  )
}
