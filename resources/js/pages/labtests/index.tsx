import AppLayout from '@/layouts/app-layout';
import { Flash, MsgType, LabtestsPaginated, LabtestsQrystr, type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, FileDown, RotateCcw } from 'lucide-react';
import LabtestsTable from './components/labtests-table';
import { Button } from '@/components/ui/button';
import LabtestsSearch from './components/labtests-search';
import { useEffect, useState } from 'react';
import LabtestForm from './labtest-form';
import { toast } from 'sonner';
import FilterBadges from './components/filter-badges';
import { FilterDialog } from './components/filter-dialog';
import { limpiarObjeto } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLabtestsStore } from '@/store/labtests-store';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Exámenes de laboratorio',
    href: '/labtests',
  },
];

const labtestsQrystrInit: LabtestsQrystr = {
  search: '',
  sortby: null,
  page: null,
  per_page: null,
}

interface IndexProps {
  labtests: LabtestsPaginated;
  qrystr: LabtestsQrystr;
}

export default function Index({ labtests, qrystr }: IndexProps) {
  const view = useLabtestsStore(state => state.view)
  const setView = useLabtestsStore(state => state.setView)

  const [firstRender, setFirstRender] = useState(true);
  const { flash } = usePage<{ flash: Flash }>().props;

  const labtestsQrystr = useForm<LabtestsQrystr>({
    search: qrystr.search || '',
    sortby: qrystr.sortby || null,
    page: qrystr.page || null,
    per_page: qrystr.per_page || null,
  });

  const handlePaginate = (val: string) => {
    labtestsQrystr.setData({ ...labtestsQrystr.data, per_page: val, page: null });
  }

  const applyFilter = () => {
    const newQueryString = {
      ...(labtestsQrystr.data.search && { search: labtestsQrystr.data.search }),
      ...(labtestsQrystr.data.sortby && { sortby: labtestsQrystr.data.sortby }),
      ...(labtestsQrystr.data.page && { page: labtestsQrystr.data.page }),
      ...(labtestsQrystr.data.per_page && { per_page: labtestsQrystr.data.per_page }),
    };
    router.get(route('labtests.index'), newQueryString, {
      preserveScroll: true,
      preserveState: true,
    })
  };

  const resetFilter = () => {
    labtestsQrystr.setData(labtestsQrystrInit);
    router.get(
      route('labtests.index'),
      {}, // request payload
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const getPdf = () => {
    const queryString = limpiarObjeto(labtestsQrystr.data);
    window.open(route('labtests.pdf', queryString), '_blank');
  }

  const exportLabtests = () => {
    const queryString = limpiarObjeto(labtestsQrystr.data);
    window.open(route('labtests.export-labtests', queryString));
  }

  useEffect(() => {
    if (!firstRender) {
      applyFilter();
    } else {
      setFirstRender(false);
    };
    return () => setView('table')
  }, [labtestsQrystr.data]);

  useEffect(() => {
    if (!flash) return;
    toast[flash?.type as MsgType](flash.msg);
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Exámenes de laboratorio" />
      {/* SECCION TABLA */}
      <section className={`flex h-[calc(100vh-80px)] flex-col gap-2 rounded-xl p-2 lg:p-4 pb-2 ${view === 'table' ? '' : 'hidden'}`}>
        <div className="flex flex-col gap-2 lg:flex-row   lg:items-center lg:justify-between">
          <div className='flex gap-2 items-center'>
            <FilterDialog
              labtestsQrystr={labtestsQrystr}
            />
            <LabtestsSearch labtestsQrystr={labtestsQrystr} />
          </div>
          <div className='flex gap-2 justify-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" title='Exportar exámenes'><FileDown /></Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => getPdf()}>
                  Exportar en PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportLabtests()}>
                  Descargar en Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={resetFilter} title='Recargar página'>
              <RotateCcw /><span className='hidden lg:block'>reset</span>
            </Button>
            <Button onClick={() => { setView('form') }}>
              <CirclePlus /> <div className='hidden lg:block'>Agregar examen</div><div className='block lg:hidden'>Agregar</div>
            </Button>
          </div>
        </div>
        <FilterBadges
          labtestsQrystr={labtestsQrystr}
        />
        {/* TABLA DE PRODUCTOS */}
        <LabtestsTable
          labtests={labtests}
          labtestsQrystr={labtestsQrystr}
          handlePaginate={handlePaginate}
        />
      </section>
      {/* SECCION FORMULARIO */}
      <section className={`flex h-full flex-col gap-4 rounded-xl p-4 ${view === 'form' ? '' : 'hidden'}`}>
        {view === 'form' && (
          <LabtestForm
          />
        )}
      </section>
    </AppLayout>
  );
}
