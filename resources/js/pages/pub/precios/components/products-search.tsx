import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { PricesQrystr } from "@/types";
import { InertiaFormProps } from "@inertiajs/react";
import { Search, X } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

type ProductSearchProps = {
  pricesQrystr: InertiaFormProps<PricesQrystr>;
}
const SEARCH_DEBOUNCE_MS = 400;
export default function ProductsSearch({ pricesQrystr }: ProductSearchProps) {
  const [search, setSearch] = useState(pricesQrystr.data.search || '');
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  // sincroniza el input cuando la busqueda cambia externamente (ej. reset)
  useEffect(() => {
    setSearch(pricesQrystr.data.search || '');
  }, [pricesQrystr.data.search]);

  // actualiza qrystr una sola vez cuando termina el debounce
  useEffect(() => {
    if (debouncedSearch === (pricesQrystr.data.search || '')) return;
    pricesQrystr.setData({ ...pricesQrystr.data, search: debouncedSearch, page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const resetSearch = () => {
    setSearch('')
  }

  return (
    <section aria-label="Búsqueda" className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        // type="search"
        placeholder="Buscar servicio…"
        className="h-14 rounded-full border-2 bg-card pl-12 pr-14 text-base shadow-sm md:text-lg"
        value={search}
        onChange={handleChange}
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Limpiar búsqueda"
        className="absolute right-2 top-1/2 size-10 -translate-y-1/2 rounded-full text-muted-foreground"
        onClick={resetSearch}
      >
        <X className="size-5" />
      </Button>
    </section>
  )
}
