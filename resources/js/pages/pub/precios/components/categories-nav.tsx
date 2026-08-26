import { Button } from "@/components/ui/button";
import useService from "@/hooks/use-service";
import { useCatalogsStore } from "@/store/catalogs-store";
import { Category, PricesQrystr } from "@/types";
import { InertiaFormProps } from "@inertiajs/react";
import { useEffect } from "react";

interface Props {
  pricesQrystr: InertiaFormProps<PricesQrystr>
}
export default function CategoriesNav({ pricesQrystr }: Props) {
  const { categories, setCategories } = useCatalogsStore(state => state);
  const { getCategories, data: categoriesData } = useService<Category[]>();

  const filtrar = (category: Category | null) => {
    if(category){
      pricesQrystr.setData({...pricesQrystr.data, category_id: category.id, page: null});
    }else{
      pricesQrystr.setData({...pricesQrystr.data, category_id: null, page: null});
    }
  }
  
  useEffect(() => {
    if (!categories) {
      getCategories();
    }
  }, []);

  useEffect(() => {
    if (!categoriesData) return;
    setCategories(categoriesData)
  }, [categoriesData]);

  return (
    <nav aria-label="Categorías" className="mt-4 flex touch-manipulation gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
      <Button
        variant={!pricesQrystr.data.category_id ? 'default' : 'outline'}
        aria-pressed={!pricesQrystr.data.category_id}
        className="h-11 shrink-0 touch-manipulation rounded-full px-6 text-base font-medium active:scale-95"
        onClick={e=>filtrar(null)}
      >
        Todos
      </Button>
      {categories && categories.map((category) => (
        <Button
          key={category.id}
          variant={pricesQrystr.data.category_id == category.id ? 'default' : 'outline'}
          aria-pressed={pricesQrystr.data.category_id == category.id}
          className="h-11 shrink-0 touch-manipulation rounded-full px-6 text-base font-medium active:scale-95"
          onClick={e=>filtrar(category)}
        >
          {category.name}
        </Button>
      ))}
    </nav>
  )
}
