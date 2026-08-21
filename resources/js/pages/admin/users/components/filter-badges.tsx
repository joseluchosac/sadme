import { Badge } from "@/components/ui/badge";
import { useUsersTableConfigStore } from "@/store/users-table-config-store";
import { Qrystr } from "@/types";
import { InertiaFormProps} from "@inertiajs/react";
import { CircleX } from "lucide-react";

interface FilterBadgesProps {
  usersQrystr: InertiaFormProps<Qrystr>;
}


export default function FilterBadges({ usersQrystr }: FilterBadgesProps) {
  const columns = useUsersTableConfigStore(state => state.columns);

  const currentSortField = usersQrystr.data.sortby?.split('-')[0];
  const currentSortOrder = usersQrystr.data.sortby?.split('-')[1] ?? 'asc';
  const sorted = columns.find(el=>el.key == currentSortField)

  const handleClickBadge = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const field = e.currentTarget.dataset.name;
    if (field) {
      if (field === 'searched') {
        usersQrystr.setData('search', '');
      } else if (field === 'sort') {
        usersQrystr.setData({ ...usersQrystr.data, sortby: null, page: null });
      }
    }
  }

  return (
    <div className='flex  gap-2 justify-center text-nowrap'>
      {usersQrystr.data.search && (
        <Badge
          className='bg-amber-500 cursor-pointer'
          data-name="searched"
          onClick={handleClickBadge}
        >
          <CircleX size={16} className='mr-1' /> Buscado por: {usersQrystr.data.search}
        </Badge>
      )}
      {usersQrystr.data.sortby && (
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
