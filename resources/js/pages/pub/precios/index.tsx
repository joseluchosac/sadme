import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, router, useForm } from '@inertiajs/react';
import {
  ArrowUpDown,
  FlaskConical,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from 'lucide-react';
// import FilterBadges from './components/filter-badges';
import CategoriesNav from './components/categories-nav';
import ProductsSearch from './components/products-search';
import { PricesQrystr, ProductsPaginated, } from '@/types';
import ProductCard from './components/product-card';
import { useEffect, useState } from 'react';
import { Pagination } from '@/components/ui/custom/pagination';

interface Props {
  products: ProductsPaginated;
  qrystr: PricesQrystr
}

const pricesQrystrInit: PricesQrystr = {
  search: '',
  category_id: null,
  sortby: null,
  page: null,
  per_page: null,
}

export default function Index({ products, qrystr }: Props) {
  const [firstRender, setFirstRender] = useState(true);
  const pricesQrystr = useForm<PricesQrystr>({
    search: qrystr.search || '',
    category_id: qrystr.category_id || null,
    sortby: qrystr.sortby || null,
    page: qrystr.page || null,
    per_page: qrystr.per_page || null,
  });

  const handlePaginate = (val: string) => {
    pricesQrystr.setData({ ...pricesQrystr.data, per_page: val, page: null });
  }

  const applyFilter = () => {
    const newQueryString = {
      ...(pricesQrystr.data.search && { search: pricesQrystr.data.search }),
      ...(pricesQrystr.data.category_id && { category_id: pricesQrystr.data.category_id }),
      ...(pricesQrystr.data.sortby && { sortby: pricesQrystr.data.sortby }),
      ...(pricesQrystr.data.page && { page: pricesQrystr.data.page }),
      ...(pricesQrystr.data.per_page && { per_page: pricesQrystr.data.per_page }),
    };
    router.get(route('pub.precios'), newQueryString, {
      preserveScroll: true,
      preserveState: true,
    })
  };

  const resetFilter = () => {
    pricesQrystr.setData(pricesQrystrInit);
    router.get(
      route('pub.precios'),
      {}, // request payload
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  useEffect(() => {
    if (!firstRender) {
      applyFilter();
    } else {
      setFirstRender(false);
    }
  }, [pricesQrystr.data]);

  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <Head title="Consulta de precios" />
      <header className="sticky top-0 z-10 border-b bg-indigo-50 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-50 shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 md:px-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15 md:size-14">
            <FlaskConical className="size-7 md:size-8" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight md:text-3xl">Consulta de Precios</h1>
            <p className="truncate text-xs md:text-sm">
              Catálogo de precios
            </p>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 md:px-6 md:py-8">
        <ProductsSearch pricesQrystr={pricesQrystr} />
        <CategoriesNav pricesQrystr={pricesQrystr} />
        <section aria-label="Filtros" className="mt-4 flex items-center gap-2">
          <Button variant="outline" className="h-11 touch-manipulation gap-2 rounded-xl px-4 text-base active:scale-95">
            <ArrowUpDown className="size-5" aria-hidden="true" />
            Ordenar
          </Button>
          <Button variant="outline" className="relative h-11 touch-manipulation gap-2 rounded-xl px-4 text-base active:scale-95">
            <SlidersHorizontal className="size-5" aria-hidden="true" />
            Filtros
            <Badge className="absolute -right-2 -top-2 size-6 items-center justify-center rounded-full p-0 text-xs">2</Badge>
          </Button>
          <div className="ml-auto flex items-center rounded-xl border bg-card p-1">
            <Button variant="secondary" size="icon" aria-label="Vista de tarjetas" className="size-9 rounded-lg active:scale-95">
              <LayoutGrid className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Vista de lista" className="size-9 rounded-lg active:scale-95">
              <List className="size-5" />
            </Button>
          </div>
        </section>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground md:text-base">
            <span className="text-base font-bold text-foreground md:text-lg">{products.total}</span>{' '}
            resultados encontrados
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {/* <FilterBadges /> */}
            <Button
              variant="ghost"
              className="h-8 rounded-full px-3 text-sm text-muted-foreground underline-offset-4 hover:underline"
              onClick={resetFilter}
            >
              Limpiar todo
            </Button>
          </div>
        </div>
        <section aria-label="Exámenes" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.data.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </section>
        <div className='mt-6'>
          <Pagination
            paginationData={products}
            handlePaginate={handlePaginate}
            per_page={pricesQrystr.data.per_page || '250'}
          />
        </div>
      </main>
      <footer className="border-t bg-card py-4">
        <p className="text-center text-xs text-muted-foreground md:text-sm">
          Precios referenciales sujetos a variación · Policlínico Reyna de la Paz
        </p>
      </footer>
    </div>
  );
}
