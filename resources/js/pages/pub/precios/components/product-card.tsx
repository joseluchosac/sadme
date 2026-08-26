import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Feature, ProductItem } from "@/types"
import { Clock, Droplets, UtensilsCrossed } from "lucide-react"

interface Props {
  product: ProductItem
}
export default function ProductCard({ product }: Props) {
  return (
    <article
      key={product.id}
      className="flex touch-manipulation select-none flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm transition active:scale-[0.99] md:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
          {product.category_name}
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">{product.code}</span>
      </div>

      <h2 className="text-lg font-bold leading-snug md:text-xl">{product.name}</h2>

      <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

      <ul className="flex flex-wrap gap-1.5">
        <Features features={product.features || []} />
      </ul>

      <p className="line-clamp-2 text-sm text-yellow-600">{product.observations}</p>
      <Separator className="mt-auto" />

      <div className="flex items-end justify-between gap-2">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Precio</span>
        <p className="text-2xl font-extrabold tabular-nums text-primary md:text-3xl">
          {!!product.show_price ? `S/ ${Number(product.price).toFixed(2)}` : 'No disp.'}
          
        </p>
      </div>
    </article>
  )
}

function Features({ features }: { features: Feature[] }) {
  // Las siguentes características saldrá en el card
  const myFeatures = [
    {clave: 'muestra' },
    {clave: 'ayuno' },
    {clave: 'resultado' }
  ];

  const featuresFiltered = features.filter(feature => {
    const clave = feature[0].toLocaleLowerCase();
    if (myFeatures.some(i => i.clave.toLocaleLowerCase() == clave)) return true;
    return false
  }).map(el=>({
    clave: el[0],
    valor: el[1]
  }))
  return (
    <>
      {featuresFiltered.map(el => (
        <li key={el.clave} className="inline-flex h-7 items-center gap-1.5 rounded-full border bg-muted/50 px-2.5 text-xs font-medium text-muted-foreground">
          {el.clave.toLocaleLowerCase() == 'muestra' && <Droplets className="size-3.5 shrink-0" aria-hidden="true" />}
          {el.clave.toLocaleLowerCase() == 'ayuno' && <UtensilsCrossed className="size-3.5 shrink-0" aria-hidden="true" />}
          {el.clave.toLocaleLowerCase() == 'resultado' && <Clock className="size-3.5 shrink-0" aria-hidden="true" />}
          {el.valor}
        </li>
      ))}
    </>
  );
}
