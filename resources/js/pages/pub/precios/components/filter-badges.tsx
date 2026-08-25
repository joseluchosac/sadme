import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function FilterBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary" className="h-8 gap-1.5 rounded-full px-3 text-sm font-normal">
        Hematología
        <X className="size-3.5" aria-hidden="true" />
      </Badge>
      <Badge variant="secondary" className="h-8 gap-1.5 rounded-full px-3 text-sm font-normal">
        Precio: S/ 10 – S/ 50
        <X className="size-3.5" aria-hidden="true" />
      </Badge>
      <Button
        variant="ghost"
        className="h-8 rounded-full px-3 text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Limpiar todo
      </Button>
    </div>
  )
}
