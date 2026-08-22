import { Badge } from "@/components/ui/badge";
import { useLabtestsStore } from "@/store/labtests-store";
import { LabtestsQrystr } from "@/types";
import { InertiaFormProps} from "@inertiajs/react";
import { CircleX } from "lucide-react";

interface FilterBadgesProps {
  labtestsQrystr: InertiaFormProps<LabtestsQrystr>;
}


export default function FilterBadges({ labtestsQrystr }: FilterBadgesProps) {
  const columns = useLabtestsStore(state => state.columns);
  const currentSortField = labtestsQrystr.data.sortby?.split('-')[0];
  const currentSortOrder = labtestsQrystr.data.sortby?.split('-')[1] ?? 'asc';
  const sorted = columns.find(el=>el.key == currentSortField)

  const handleClickBadge = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const field = e.currentTarget.dataset.name;
    if (field) {
      if (field === 'searched') {
        labtestsQrystr.setData('search', '');
      } else if (field === 'sort') {
        labtestsQrystr.setData({ ...labtestsQrystr.data, sortby: null, page: null });
      }
    }
  }

  return (
    <div className='flex  gap-2 justify-center text-nowrap'>
      {labtestsQrystr.data.search && (
        <Badge
          className='bg-amber-500 cursor-pointer'
          data-name="searched"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Buscado por: {labtestsQrystr.data.search}
        </Badge>
      )}
      {labtestsQrystr.data.sortby && (
        <Badge 
          className='bg-blue-600 cursor-pointer'
          data-name="sort"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Ordenado por: {sorted?.label} {currentSortOrder === 'asc' ? '↑' : '↓'}
        </Badge>
      )}
    </div>
  )
}
