import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { UsersPaginated, Flash, MsgType, Qrystr, type BreadcrumbItem, Role } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import UsersSearch from './components/users-search';
import UsersTable from './components/users-table';
import { Pagination } from '@/components/ui/custom/pagination';
import UserForm from './user-form';
import FilterBadges from './components/filter-badges';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: '/users',
  },
];

const usersQrystrInit: Qrystr = {
  search: '',
  sortby: null,
  page: null,
  per_page: null,
}

interface IndexProps {
  users: UsersPaginated;
  qrystr: Qrystr;
}

export default function Index({ users, qrystr }: IndexProps) {
  const [firstRender, setFirstRender] = useState(true);
  const [view, setView] = useState('table'); // 'form', 'table'
  const [userId, setUserId] = useState<number | null>(null);
  const { flash } = usePage<{ flash: Flash }>().props;
  const usersQrystr = useForm<Qrystr>({
    search: qrystr.search || '',
    sortby: qrystr.sortby || null, // o significa order
    page: qrystr.page || null,
    per_page: qrystr.per_page || null,
  });

  const handlePaginate = (val: string) => {
    usersQrystr.setData({...usersQrystr.data, per_page: val, page: null});
  }

  const applyFilter = () => {
    const newQueryString = {
      ...(usersQrystr.data.search && { search: usersQrystr.data.search }),
      ...(usersQrystr.data.sortby && { sortby: usersQrystr.data.sortby }),
      ...(usersQrystr.data.page && { page: usersQrystr.data.page }),
      ...(usersQrystr.data.per_page && { per_page: usersQrystr.data.per_page }),
    };
    router.get(route('admin.users.index'), newQueryString, {
      preserveScroll: true,
      preserveState: true,
    })
  };

  const resetFilter = () => {
    usersQrystr.setData(usersQrystrInit);
    router.get(
      route('admin.users.index'),
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
  }, [usersQrystr.data]);

  useEffect(() => {
    if (!flash) return;
    toast[flash?.type as MsgType](flash.msg);
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuarios" />
      {/* SECCION TABLA */}
      <div className={`flex h-[calc(100vh-80px)] flex-col gap-2 rounded-xl p-2 lg:p-4 pb-2 ${view === 'table' ? '' : 'hidden'}`}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <UsersSearch usersQrystr={usersQrystr} />
          </div>
          <div className='flex gap-2 justify-center'>
            <Button variant="outline" onClick={resetFilter} title='Recargar página'>
              <RotateCcw /><span className='hidden lg:block'>reset</span>
            </Button>
            <Button onClick={() => { setView('form') }}>
              <CirclePlus /> <div className='hidden lg:block'>Nuevo usuario</div><div className='block lg:hidden'>Agregar</div>
            </Button>
          </div>
        </div>
        <FilterBadges 
          usersQrystr={usersQrystr}
        />
        <div className="grow overflow-hidden bg-slate-50 dark:bg-slate-950">
          <ScrollArea className="h-full rounded-md border relative">
            {/* TABLA */}
            <UsersTable
              users={users} 
              usersQrystr={usersQrystr} 
              setUserId={setUserId}
              setView={setView}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <Pagination
          paginationData={users}
          handlePaginate={handlePaginate}
          per_page={usersQrystr.data.per_page || '50'}
        />
      </div>
      {/* SECCION FORMULARIO */}
      <div className={`flex h-full flex-col gap-4 rounded-xl p-4 ${view === 'form' ? '' : 'hidden'}`}>
        {view === 'form' && (
          <UserForm
            userId={userId}
            onClose={() => {
              setView('table')
              setUserId(null)
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}

