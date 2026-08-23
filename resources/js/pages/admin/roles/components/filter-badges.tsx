import { Badge } from "@/components/ui/badge";
import { useRolesStore } from "@/store/roles-store";
import { Qrystr } from "@/types";
import { InertiaFormProps} from "@inertiajs/react";
import { CircleX } from "lucide-react";

interface FilterBadgesProps {
  rolesQrystr: InertiaFormProps<Qrystr>;
}


export default function FilterBadges({ rolesQrystr }: FilterBadgesProps) {
  const columns = useRolesStore(state => state.columns);

  const currentSortField = rolesQrystr.data.sortby?.split('-')[0];
  const currentSortOrder = rolesQrystr.data.sortby?.split('-')[1] ?? 'asc';
  const sorted = columns.find(el=>el.key == currentSortField)

  const handleClickBadge = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const field = e.currentTarget.dataset.name;
    if (field) {
      if (field === 'searched') {
        rolesQrystr.setData('search', '');
      } else if (field === 'sort') {
        rolesQrystr.setData({ ...rolesQrystr.data, sortby: null, page: null });
      }
    }
  }

  return (
    <div className='flex  gap-2 justify-center text-nowrap'>
      {rolesQrystr.data.search && (
        <Badge
          className='bg-amber-500 cursor-pointer'
          data-name="searched"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Buscado por: {rolesQrystr.data.search}
        </Badge>
      )}
      {rolesQrystr.data.sortby && (
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
