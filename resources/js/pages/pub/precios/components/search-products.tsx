import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function SearchProducts() {
    return (
        <section aria-label="Búsqueda" className="relative">
            <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
            />
            <Input
                type="search"
                placeholder="Buscar examen por nombre o código…"
                readOnly
                className="h-14 rounded-full border-2 bg-card pl-12 pr-14 text-base shadow-sm md:text-lg"
            />
            <Button
                variant="ghost"
                size="icon"
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 size-10 -translate-y-1/2 rounded-full text-muted-foreground"
            >
                <X className="size-5" />
            </Button>
        </section>
    )
}
