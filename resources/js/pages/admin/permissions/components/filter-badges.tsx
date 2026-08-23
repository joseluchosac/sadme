import { Badge } from "@/components/ui/badge";
import { usePermissionsStore } from "@/store/permissions-store";
import { Qrystr } from "@/types";
import { InertiaFormProps} from "@inertiajs/react";
import { CircleX } from "lucide-react";

interface FilterBadgesProps {
  permissionsQrystr: InertiaFormProps<Qrystr>;
}


export default function FilterBadges({ permissionsQrystr }: FilterBadgesProps) {
  const columns = usePermissionsStore(state => state.columns);

  const currentSortField = permissionsQrystr.data.sortby?.split('-')[0];
  const currentSortOrder = permissionsQrystr.data.sortby?.split('-')[1] ?? 'asc';
  const sorted = columns.find(el=>el.key == currentSortField)

  const handleClickBadge = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const field = e.currentTarget.dataset.name;
    if (field) {
      if (field === 'searched') {
        permissionsQrystr.setData('search', '');
      } else if (field === 'sort') {
        permissionsQrystr.setData({ ...permissionsQrystr.data, sortby: null, page: null });
      }
    }
  }

  return (
    <div className='flex  gap-2 justify-center text-nowrap'>
      {permissionsQrystr.data.search && (
        <Badge
          className='bg-amber-500 cursor-pointer'
          data-name="searched"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Buscado por: {permissionsQrystr.data.search}
        </Badge>
      )}
      {permissionsQrystr.data.sortby && (
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
