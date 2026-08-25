import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Head } from '@inertiajs/react';
import {
    ArrowUpDown,
    Clock,
    Droplets,
    FlaskConical,
    LayoutGrid,
    List,
    SlidersHorizontal,
    UtensilsCrossed,
    type LucideIcon,
} from 'lucide-react';
import FilterBadges from './components/filter-badges';
import CategoriesNav from './components/categories-nav';
import SearchProducts from './components/search-products';

type Categoria = 'Todos' | 'Consultas' | 'Laboratorio' | 'Ecografía';

interface ExamenPrecio {
    id: number;
    code: string;
    name: string;
    category: Exclude<Categoria, 'Todos'>;
    description: string;
    muestra: string;
    ayuno?: string;
    resultado: string;
    price: number;
}


const examenes: ExamenPrecio[] = [
    {
        id: 1,
        code: 'HEM-001',
        name: 'Hemograma Completo',
        category: 'Laboratorio',
        description: 'Evalúa glóbulos rojos, blancos y plaquetas. Detecta anemia, infecciones y alteraciones de la coagulación.',
        muestra: 'Sangre venosa',
        resultado: '24 h',
        price: 25,
    },
    {
        id: 2,
        code: 'BIO-001',
        name: 'Glucosa en Ayunas',
        category: 'Laboratorio',
        description: 'Mide los niveles de azúcar en sangre para descartar diabetes o hipoglucemia.',
        muestra: 'Sangre venosa',
        ayuno: 'Ayuno 8 h',
        resultado: '4 h',
        price: 12,
    },
    {
        id: 3,
        code: 'BIO-002',
        name: 'Perfil Lipídico',
        category: 'Laboratorio',
        description: 'Colesterol total, HDL, LDL y triglicéridos para evaluar riesgo cardiovascular.',
        muestra: 'Suero',
        ayuno: 'Ayuno 12 h',
        resultado: '24 h',
        price: 45,
    },
    {
        id: 4,
        code: 'BIO-003',
        name: 'Ácido Úrico',
        category: 'Laboratorio',
        description: 'Detecta niveles elevados asociados a gota y problemas renales.',
        muestra: 'Suero',
        ayuno: 'Ayuno 4 h',
        resultado: '6 h',
        price: 15,
    },
    {
        id: 5,
        code: 'ORI-001',
        name: 'Examen Completo de Orina',
        category: 'Laboratorio',
        description: 'Análisis físico, químico y microscópico de la orina. Evalúa vías urinarias y riñones.',
        muestra: 'Orina',
        resultado: '6 h',
        price: 18,
    },
    {
        id: 6,
        code: 'ORI-002',
        name: 'Coproparasitológico',
        category: 'Laboratorio',
        description: 'Identifica parásitos intestinales en heces mediante examen directo y concentrado.',
        muestra: 'Heces',
        resultado: '24 h',
        price: 20,
    },
    {
        id: 7,
        code: 'HOR-001',
        name: 'TSH',
        category: 'Laboratorio',
        description: 'Hormona estimulante de la tiroides. Primer estudio para evaluar función tiroidea.',
        muestra: 'Suero',
        resultado: '48 h',
        price: 35,
    },
    {
        id: 8,
        code: 'HOR-002',
        name: 'T4 Libre',
        category: 'Laboratorio',
        description: 'Mide la hormona tiroidea activa en sangre. Complementa el estudio de TSH.',
        muestra: 'Suero',
        resultado: '48 h',
        price: 38,
    },
    {
        id: 9,
        code: 'INM-001',
        name: 'Prueba Rápida VDRL',
        category: 'Laboratorio',
        description: 'Tamizaje de sífilis mediante prueba serológica rápida.',
        muestra: 'Sangre capilar',
        resultado: '30 min',
        price: 22,
    },
    {
        id: 10,
        code: 'INM-002',
        name: 'Factor Reumatoideo',
        category: 'Laboratorio',
        description: 'Marcador sérico para el diagnóstico de artritis reumatoidea.',
        muestra: 'Suero',
        resultado: '24 h',
        price: 20,
    },
    {
        id: 11,
        code: 'INM-003',
        name: 'Prueba de Embarazo en Sangre',
        category: 'Laboratorio',
        description: 'β-hCG cuantitativa en suero. Mayor sensibilidad que la prueba de orina.',
        muestra: 'Suero',
        resultado: '4 h',
        price: 30,
    },
    {
        id: 12,
        code: 'HEM-002',
        name: 'Grupo Sanguíneo y Factor RH',
        category: 'Laboratorio',
        description: 'Determina el tipo de sangre ABO y el factor RH positivo o negativo.',
        muestra: 'Sangre capilar',
        resultado: '2 h',
        price: 18,
    },
];

function Caracteristica({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
    return (
        <li className="inline-flex h-7 items-center gap-1.5 rounded-full border bg-muted/50 px-2.5 text-xs font-medium text-muted-foreground">
            <Icon className="size-3.5 shrink-0" aria-hidden="true" />
            {label}
        </li>
    );
}

export default function Index() {
    return (
        <div className="flex min-h-svh flex-col bg-muted/30">
            <Head title="Consulta de precios" />

            <header className="sticky top-0 z-10 border-b bg-primary text-primary-foreground shadow-sm">
                <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 md:px-6">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15 md:size-14">
                        <FlaskConical className="size-7 md:size-8" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-bold tracking-tight md:text-3xl">Consulta de Precios</h1>
                        <p className="truncate text-xs text-primary-foreground/80 md:text-sm">
                            Catálogo público de exámenes de laboratorio
                        </p>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 md:px-6 md:py-8">
                <SearchProducts />

                <CategoriesNav />

                <section aria-label="Filtros" className="mt-4 flex items-center gap-2">
                    <Button variant="outline" className="h-11 touch-manipulation gap-2 rounded-xl px-4 text-base active:scale-95">
                        <ArrowUpDown className="size-5" aria-hidden="true" />
                        Ordenar
                    </Button>
                    <Button variant="outline" className="relative h-11 touch-manipulation gap-2 rounded-xl px-4 text-base active:scale-95">
                        <SlidersHorizontal className="size-5" aria-hidden="true" />
                        Filtros
                        <Badge className="absolute -right-2 -top-2 size-6 items-center justify-center rounded-full p-0 text-xs">2</Badge>
                    </Button>
                    <div className="ml-auto flex items-center rounded-xl border bg-card p-1">
                        <Button variant="secondary" size="icon" aria-label="Vista de tarjetas" className="size-9 rounded-lg active:scale-95">
                            <LayoutGrid className="size-5" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Vista de lista" className="size-9 rounded-lg active:scale-95">
                            <List className="size-5" />
                        </Button>
                    </div>
                </section>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground md:text-base">
                        <span className="text-base font-bold text-foreground md:text-lg">{examenes.length}</span>{' '}
                        resultados encontrados
                    </p>
                    <FilterBadges />
                </div>

                <section aria-label="Exámenes" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {examenes.map((examen) => (
                        <article
                            key={examen.id}
                            className="flex touch-manipulation select-none flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm transition active:scale-[0.99] md:p-5"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                                    {examen.category}
                                </Badge>
                                <span className="font-mono text-xs text-muted-foreground">{examen.code}</span>
                            </div>

                            <h2 className="text-lg font-bold leading-snug md:text-xl">{examen.name}</h2>

                            <p className="line-clamp-2 text-sm text-muted-foreground">{examen.description}</p>

                            <ul className="flex flex-wrap gap-1.5">
                                <Caracteristica icon={Clock} label={examen.resultado} />
                                <Caracteristica icon={Droplets} label={examen.muestra} />
                                {examen.ayuno && <Caracteristica icon={UtensilsCrossed} label={examen.ayuno} />}
                            </ul>

                            <Separator className="mt-auto" />

                            <div className="flex items-end justify-between gap-2">
                                <span className="text-xs uppercase tracking-wide text-muted-foreground">Precio</span>
                                <p className="text-2xl font-extrabold tabular-nums text-primary md:text-3xl">
                                    S/ {examen.price.toFixed(2)}
                                </p>
                            </div>
                        </article>
                    ))}
                </section>
            </main>

            <footer className="border-t bg-card py-4">
                <p className="text-center text-xs text-muted-foreground md:text-sm">
                    Precios referenciales sujetos a variación · Laboratorio Clínico SADME
                </p>
            </footer>
        </div>
    );
}
