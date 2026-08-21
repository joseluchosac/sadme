import { Link } from "@inertiajs/react"
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from "@radix-ui/react-select";

interface LinkProps {
  active: boolean;
  label: string;
  url: string | null;
}

interface PaginationData {
  links: LinkProps[];
  from: number;
  to: number;
  total: number;
  per_page: number;
}

interface PaginationProps {
  paginationData: PaginationData;
  handlePaginate: (val: string) => void;
  per_page: string;
}

export const Pagination = ({ paginationData, handlePaginate, per_page }: PaginationProps) => {

  if (!paginationData.total) return null;

  return (
    <div className="flex gap-2 items-center justify-between overflow-x-auto min-h-[40px]">
      <Select 
        value={per_page || '50'} 
        onValueChange={handlePaginate}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Filas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
      <small
        className="text-nowrap hidden xl:block"
      >
        Mostrando del {paginationData.from} al {paginationData.to} de {paginationData.total} reg
      </small>
      {!(paginationData.total <= paginationData.per_page)
        ? <div className="flex gap-2 align-middle my-1">
          {paginationData.links.map((link, index) => (
            <Link
              className={`px-2 py-1 h-full border rounded text-sm ${link.active ? 'dark:bg-white dark:text-black bg-black text-white' : ''} ${link.active || link.label == '...' ? 'pointer-events-none' : ''}`}
              key={index}
              href={link.url || '#'}
            >
              {link.label == "&laquo; Anterior" ? "<" : link.label == "Siguiente &raquo;" ? ">" : link.label}
            </Link>
          ))}
        </div>
        : null
      }

    </div>
  )
}