import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Feature, ProductData, PricesQrystr, ProductsPaginated } from '@/types';
import useService from '@/hooks/use-service';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
  ArrowUpDown,
  FlaskConical,
  Home,
  LayoutGrid,
  List,
  Phone,
  SlidersHorizontal,
} from 'lucide-react';
import CategoriesNav from './components/categories-nav';
import ProductsSearch from './components/products-search';
import ProductCard from './components/product-card';
import { useEffect, useState } from 'react';
import { Pagination } from '@/components/ui/custom/pagination';
import Header from '../components/header';

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
  const [modalOpen, setModalOpen] = useState(false);
  const { getProductPublic, data: productData, isLoading, reset } = useService<ProductData>();
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

  const handleOpenProduct = (product: { id: number }) => {
    setModalOpen(true);
    getProductPublic(product.id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
  };

  useEffect(() => {
    if (!firstRender) {
      applyFilter();
    } else {
      setFirstRender(false);
    }
  }, [pricesQrystr.data]);

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Head title="Consulta de precios" />
      <Header showPhoneBtn={false} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 md:px-6 md:py-8 ">
        <ProductsSearch pricesQrystr={pricesQrystr} />
        <CategoriesNav pricesQrystr={pricesQrystr} />
        {/* <section aria-label="Filtros" className="mt-4 flex items-center gap-2">
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
        </section> */}
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
              onClick={handleOpenProduct}
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

      <Dialog open={modalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="max-w-90  sm:max-w-xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-6" />
            </div>
          ) : productData ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl pr-8">{productData.name}</DialogTitle>
                <DialogDescription>{productData.code}</DialogDescription>
              </DialogHeader>
              <Separator />
              <div className='-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 dark:[color-scheme:dark]'>
                <div className="flex flex-col gap-3 text-sm">
                  {productData.description && (
                    <p className="text-muted-foreground">{productData.description}</p>
                  )}
                  {productData.features && productData.features.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      {/* <span className="font-medium">Características:</span> */}
                      <ul className="flex flex-wrap gap-1.5">
                        {productData.features.map((feature: Feature, idx: number) => (
                          <li key={idx} className="inline-flex h-7 items-center gap-1.5 rounded-full border bg-muted/50 px-2.5 text-xs font-medium text-muted-foreground">
                            <span className="font-semibold">{feature[0]}:</span> {feature[1]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {productData.observations && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Observaciones:</span>
                      <span className="text-yellow-600">{productData.observations}</span>
                    </div>
                  )}
                  {productData.details && (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Detalles:</span>
                      <div
                        id='preview-quill'
                        className="text-sm text-muted-foreground [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-0.5"
                        dangerouslySetInnerHTML={{ __html: productData.details }}
                      />
                    </div>
                  )}
                </div>
              </div>
                  <Separator />
                  <div className="flex items-end justify-between">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Precio</span>
                    <p className="text-2xl font-extrabold tabular-nums text-primary">
                      {!!productData.show_price ? `S/ ${Number(productData.price).toFixed(2)}` : 'No disponible'}
                    </p>
                  </div>
            </>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No se pudo cargar la información del producto.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
