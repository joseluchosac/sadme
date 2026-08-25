import { Badge } from "@/components/ui/badge";
import { useCatalogsStore } from "@/store/catalogs-store";
import { useProductsStore } from "@/store/products-store";
import { ProductsQrystr } from "@/types";
import { InertiaFormProps} from "@inertiajs/react";
import { CircleX } from "lucide-react";

interface FilterBadgesProps {
  productsQrystr: InertiaFormProps<ProductsQrystr>;
}


export default function FilterBadges({ productsQrystr }: FilterBadgesProps) {
  const columns = useProductsStore(state => state.columns);
  const currentSortField = productsQrystr.data.sortby?.split('-')[0];
  const currentSortOrder = productsQrystr.data.sortby?.split('-')[1] ?? 'asc';
  const sorted = columns.find(el=>el.key == currentSortField)
  const categories = useCatalogsStore(state => state.categories);

  const handleClickBadge = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const field = e.currentTarget.dataset.name;
    if (field) {
      if (field === 'searched') {
        productsQrystr.setData('search', '');
      } else if (field === 'sort') {
        productsQrystr.setData({ ...productsQrystr.data, sortby: null, page: null });
      } else if (field === 'category_id') {
        productsQrystr.setData({ ...productsQrystr.data, category_id: null, page: null });
      } else if (field === 'status') {
        productsQrystr.setData({ ...productsQrystr.data, status: null, page: null });
      }
    }
  }

  return (
    <div className='flex  gap-2 justify-center text-nowrap'>
      {productsQrystr.data.search && (
        <Badge
          className='bg-amber-500 cursor-pointer'
          data-name="searched"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Buscado por: {productsQrystr.data.search}
        </Badge>
      )}
      {productsQrystr.data.sortby && (
        <Badge 
          className='bg-blue-600 cursor-pointer'
          data-name="sort"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Ordenado por: {sorted?.label} {currentSortOrder === 'asc' ? '↑' : '↓'}
        </Badge>
      )}
      {productsQrystr.data.category_id != null && (
        <Badge 
          className='bg-indigo-600 cursor-pointer'
          data-name="category_id"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Categoría: {categories?.find(el=> el.id == productsQrystr.data.category_id)?.name}
        </Badge>
      )}
      {productsQrystr.data.status != null && (
        <Badge 
          className='bg-slate-500 cursor-pointer'
          data-name="status"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' />{productsQrystr.data.status == '0' ? 'Inactivos' : 'Activos'}
        </Badge>
      )}
    </div>
  )
}
