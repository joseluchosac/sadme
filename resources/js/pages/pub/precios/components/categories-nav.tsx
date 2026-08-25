import { Button } from "@/components/ui/button";

type Categoria = 'Todos' | 'Consultas' | 'Laboratorio' | 'Ecografía';

const categorias: Categoria[] = [
  'Todos',
  'Consultas',
  'Laboratorio',
  'Ecografía',
];

export default function CategoriesNav() {
  return (
    <nav aria-label="Categorías" className="mt-4 flex touch-manipulation gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
      {categorias.map((categoria, index) => (
        <Button
          key={categoria}
          variant={index === 0 ? 'default' : 'outline'}
          aria-pressed={index === 0}
          className="h-11 shrink-0 touch-manipulation rounded-full px-6 text-base font-medium active:scale-95"
        >
          {categoria}
        </Button>
      ))}
    </nav>
  )
}
