import AppLayout from '@/layouts/app-layout';
import { AffectationType, Category, Flash, MsgType, ProductsPaginated, ProductsQrystr, Unit, type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, FileDown, RotateCcw } from 'lucide-react';
import ProductsTable from './components/products-table';
import { Button } from '@/components/ui/button';
import ProductsSearch from './components/products-search';
import { useEffect, useState } from 'react';
import ProductForm from './product-form';
import { toast } from 'sonner';
import FilterBadges from './components/filter-badges';
import { FilterDialog } from './components/filter-dialog';
import { limpiarObjeto } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProductsStore } from '@/store/products-store';
import useService from '@/hooks/use-service';
import { useCatalogsStore } from '@/store/catalogs-store';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Exámenes de laboratorio',
    href: '/products',
  },
];

const productsQrystrInit: ProductsQrystr = {
  search: '',
  category_id: null,
  status: null,
  sortby: null,
  page: null,
  per_page: null,
}

interface IndexProps {
  products: ProductsPaginated;
  qrystr: ProductsQrystr;
}

export default function Index({ products, qrystr }: IndexProps) {
  const [firstRender, setFirstRender] = useState(true);
  const view = useProductsStore(state => state.view)
  const setView = useProductsStore(state => state.setView);
  const {
    categories,
    setCategories,
    units,
    setUnits,
    affectationTypes,
    setAffectationTypes,
  } = useCatalogsStore(state => state)

  const {getCategories, data: categoriesData} = useService<Category[]>()
  const {getUnits, data: unitsData} = useService<Unit[]>()
  const {getAffectationTypes, data: affectationTypesData} = useService<AffectationType[]>()

  const { flash } = usePage<{ flash: Flash }>().props;

  const productsQrystr = useForm<ProductsQrystr>({
    search: qrystr.search || '',
    category_id: qrystr.category_id || null,
    status: qrystr.status || null,
    sortby: qrystr.sortby || null,
    page: qrystr.page || null,
    per_page: qrystr.per_page || null,
  });

  const handlePaginate = (val: string) => {
    productsQrystr.setData({ ...productsQrystr.data, per_page: val, page: null });
  }

  const applyFilter = () => {
    const newQueryString = {
      ...(productsQrystr.data.search && { search: productsQrystr.data.search }),
      ...(productsQrystr.data.category_id && { category_id: productsQrystr.data.category_id }),
      ...(productsQrystr.data.status && { status: productsQrystr.data.status }),
      ...(productsQrystr.data.sortby && { sortby: productsQrystr.data.sortby }),
      ...(productsQrystr.data.page && { page: productsQrystr.data.page }),
      ...(productsQrystr.data.per_page && { per_page: productsQrystr.data.per_page }),
    };
    router.get(route('products.index'), newQueryString, {
      preserveScroll: true,
      preserveState: true,
    })
  };

  const resetFilter = () => {
    productsQrystr.setData(productsQrystrInit);
    router.get(
      route('products.index'),
      {}, // request payload
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const getPdf = () => {
    const queryString = limpiarObjeto(productsQrystr.data);
    window.open(route('products.pdf', queryString), '_blank');
  }

  const exportProducts = () => {
    const queryString = limpiarObjeto(productsQrystr.data);
    window.open(route('products.export-products', queryString));
  }

  useEffect(() => {
    if (!firstRender) {
      applyFilter();
    } else {
      setFirstRender(false);
      if(!categories){
        getCategories();
      }
      if(!units){
        getUnits();
      }
      if(!affectationTypes){
        getAffectationTypes();
      }
    };
    return () => setView('table')
  }, [productsQrystr.data]);

  useEffect(() => {
    if (!flash) return;
    toast[flash?.type as MsgType](flash.msg);
  }, [flash]);

  useEffect(() => {
    if (!categoriesData) return;
    setCategories(categoriesData)
  }, [categoriesData]);

  useEffect(() => {
    if (!unitsData) return;
    setUnits(unitsData)
  }, [unitsData]);
  useEffect(() => {
    if (!affectationTypesData) return;
    setAffectationTypes(affectationTypesData)
  }, [affectationTypesData]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Exámenes de laboratorio" />
      {/* SECCION TABLA */}
      <section className={`flex h-[calc(100vh-80px)] flex-col gap-2 rounded-xl p-2 lg:p-4 pb-2 ${view === 'table' ? '' : 'hidden'}`}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className='flex gap-2 items-center'>
            <FilterDialog
              productsQrystr={productsQrystr}
            />
            <ProductsSearch productsQrystr={productsQrystr} />
          </div>
          <div className='flex gap-2 justify-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" title='Exportar exámenes'><FileDown /></Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => getPdf()}>
                  Exportar en PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportProducts()}>
                  Descargar en Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={resetFilter} title='Recargar página'>
              <RotateCcw /><span className='hidden lg:block'>reset</span>
            </Button>
            <Button onClick={() => { setView('form') }}>
              <CirclePlus /> <div className='hidden lg:block'>Agregar producto</div><div className='block lg:hidden'>Agregar</div>
            </Button>
          </div>
        </div>
        <FilterBadges
          productsQrystr={productsQrystr}
        />
        {/* TABLA DE PRODUCTOS */}
        <ProductsTable
          products={products}
          productsQrystr={productsQrystr}
          handlePaginate={handlePaginate}
        />
      </section>
      {/* SECCION FORMULARIO */}
      <section className={`flex h-full flex-col gap-4 rounded-xl p-4 ${view === 'form' ? '' : 'hidden'}`}>
        {view === 'form' && (
          <ProductForm />
        )}
      </section>
    </AppLayout>
  );
}
