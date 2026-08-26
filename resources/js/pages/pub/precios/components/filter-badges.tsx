import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function FilterBadges() {
  return (
    <>
      <Badge variant="secondary" className="h-8 gap-1.5 rounded-full px-3 text-sm font-normal">
        Hematología
        <X className="size-3.5" aria-hidden="true" />
      </Badge>
      <Badge variant="secondary" className="h-8 gap-1.5 rounded-full px-3 text-sm font-normal">
        Precio: S/ 10 – S/ 50
        <X className="size-3.5" aria-hidden="true" />
      </Badge>
    </>
  )
}
