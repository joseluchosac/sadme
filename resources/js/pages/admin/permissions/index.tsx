import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { PermissionsPaginated, Flash, MsgType, Qrystr, type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
// import PermissionsSearch from './components/permissions-search';
import PermissionsTable from './components/permissions-table';
import { Pagination } from '@/components/ui/custom/pagination';
import PermissionForm from './permission-form';
import FilterBadges from './components/filter-badges';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Permissions',
    href: '/admin/permissions',
  },
];

const permissionsQrystrInit: Qrystr = {
  search: '',
  sortby: null,
  page: null,
  per_page: null,
}

interface IndexProps {
  permissions: PermissionsPaginated;
  qrystr: Qrystr;
}

export default function Index({ permissions, qrystr }: IndexProps) {
  const [firstRender, setFirstRender] = useState(true);
  const [view, setView] = useState('table'); // 'form', 'table'
  const [permissionId, setPermissionId] = useState<number | null>(null);
  const { flash } = usePage<{ flash: Flash }>().props;
  
  const permissionsQrystr = useForm<Qrystr>({
    search: qrystr.search || '',
    sortby: qrystr.sortby || null,
    page: qrystr.page || null,
    per_page: qrystr.per_page || null,
  });

  const handlePaginate = (val: string) => {
    permissionsQrystr.setData({...permissionsQrystr.data, per_page: val, page: null});
  }

  const applyFilter = () => {
    const newQueryString = {
      ...(permissionsQrystr.data.search && { search: permissionsQrystr.data.search }),
      ...(permissionsQrystr.data.sortby && { sortby: permissionsQrystr.data.sortby }),
      ...(permissionsQrystr.data.page && { page: permissionsQrystr.data.page }),
      ...(permissionsQrystr.data.per_page && { per_page: permissionsQrystr.data.per_page }),
    };
    router.get(route('admin.permissions.index'), newQueryString, {
      preserveScroll: true,
      preserveState: true,
    })
  };

  const resetFilter = () => {
    permissionsQrystr.setData(permissionsQrystrInit);
    router.get(
      route('admin.permissions.index'),
      {}, // request payload
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  useEffect(() => {
    if (!firstRender){
      applyFilter();
    }else{
      setFirstRender(false);
    };
  }, [permissionsQrystr.data]);

  useEffect(() => {
    if (!flash) return;
    toast[flash?.type as MsgType](flash.msg);
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permissions" />
      {/* SECCION TABLA */}
      <div className={`flex h-[calc(100vh-80px)] flex-col gap-2 rounded-xl p-2 lg:p-4 pb-2 ${view === 'table' ? '' : 'hidden'}`}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {/* <PermissionsSearch permissionsQrystr={permissionsQrystr} /> */}
          </div>
          <div className='flex gap-2 justify-center'>
            <Button variant="outline" onClick={resetFilter} title='Recargar página'>
              <RotateCcw /><span className='hidden lg:block'>reset</span>
            </Button>
            <Button onClick={() => { setView('form') }}>
              <CirclePlus /> <div className='hidden lg:block'>Nuevo permiso</div><div className='block lg:hidden'>Agregar</div>
            </Button>
          </div>
        </div>
        <FilterBadges 
          permissionsQrystr={permissionsQrystr}
        />
        <div className="grow overflow-hidden bg-slate-50 dark:bg-slate-950">
          <ScrollArea className="h-full rounded-md border relative">
            {/* TABLA */}
            <PermissionsTable
              permissions={permissions} 
              permissionsQrystr={permissionsQrystr} 
              setPermissionId={setPermissionId}
              setView={setView}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <Pagination
          paginationData={permissions}
          handlePaginate={handlePaginate}
          per_page={permissionsQrystr.data.per_page || '50'}
        />
      </div>
      {/* SECCION FORMULARIO */}
      <div className={`flex h-full flex-col gap-4 rounded-xl p-4 ${view === 'form' ? '' : 'hidden'}`}>
        {view === 'form' && (
          <PermissionForm
            permissionId={permissionId}
            onClose={() => {
              setView('table')
              setPermissionId(null)
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}

