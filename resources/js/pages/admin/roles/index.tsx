import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { RolesPaginated, Flash, MsgType, Qrystr, type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
// import RolesSearch from './components/roles-search';
import RolesTable from './components/roles-table';
import { Pagination } from '@/components/ui/custom/pagination';
import RoleForm from './role-form';
import FilterBadges from './components/filter-badges';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Roles',
    href: '/admin/roles',
  },
];

const rolesQrystrInit: Qrystr = {
  search: '',
  sortby: null,
  page: null,
  per_page: null,
}

interface IndexProps {
  roles: RolesPaginated;
  qrystr: Qrystr;
}

export default function Index({ roles, qrystr }: IndexProps) {
  const [firstRender, setFirstRender] = useState(true);
  const [view, setView] = useState('table'); // 'form', 'table'
  const [roleId, setRoleId] = useState<number | null>(null);
  const { flash } = usePage<{ flash: Flash }>().props;
  const rolesQrystr = useForm<Qrystr>({
    search: qrystr.search || '',
    sortby: qrystr.sortby || null,
    page: qrystr.page || null,
    per_page: qrystr.per_page || null,
  });

  const handlePaginate = (val: string) => {
    rolesQrystr.setData({...rolesQrystr.data, per_page: val, page: null});
  }

  const applyFilter = () => {
    const newQueryString = {
      ...(rolesQrystr.data.search && { search: rolesQrystr.data.search }),
      ...(rolesQrystr.data.sortby && { sortby: rolesQrystr.data.sortby }),
      ...(rolesQrystr.data.page && { page: rolesQrystr.data.page }),
      ...(rolesQrystr.data.per_page && { per_page: rolesQrystr.data.per_page }),
    };
    router.get(route('admin.roles.index'), newQueryString, {
      preserveScroll: true,
      preserveState: true,
    })
  };

  const resetFilter = () => {
    rolesQrystr.setData(rolesQrystrInit);
    router.get(
      route('admin.roles.index'),
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
  }, [rolesQrystr.data]);

  useEffect(() => {
    if (!flash) return;
    toast[flash?.type as MsgType](flash.msg);
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />
      {/* SECCION TABLA */}
      <div className={`flex h-[calc(100vh-80px)] flex-col gap-2 rounded-xl p-2 lg:p-4 pb-2 ${view === 'table' ? '' : 'hidden'}`}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {/* <RolesSearch rolesQrystr={rolesQrystr} /> */}
          </div>
          <div className='flex gap-2 justify-center'>
            <Button variant="outline" onClick={resetFilter} title='Recargar página'>
              <RotateCcw /><span className='hidden lg:block'>reset</span>
            </Button>
            <Button onClick={() => { setView('form') }}>
              <CirclePlus /> <div className='hidden lg:block'>Nuevo Rol</div><div className='block lg:hidden'>Agregar</div>
            </Button>
          </div>
        </div>
        <FilterBadges 
          rolesQrystr={rolesQrystr}
        />
        <div className="grow overflow-hidden bg-slate-50 dark:bg-slate-950">
          <ScrollArea className="h-full rounded-md border relative">
            {/* TABLA */}
            <RolesTable
              roles={roles} 
              rolesQrystr={rolesQrystr} 
              setRoleId={setRoleId}
              setView={setView}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <Pagination
          paginationData={roles}
          handlePaginate={handlePaginate}
          per_page={rolesQrystr.data.per_page || '50'}
        />
      </div>
      {/* SECCION FORMULARIO */}
      <div className={`flex h-full flex-col gap-4 rounded-xl p-4 ${view === 'form' ? '' : 'hidden'}`}>
        {view === 'form' && (
          <RoleForm
            roleId={roleId}
            onClose={() => {
              setView('table')
              setRoleId(null)
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}

