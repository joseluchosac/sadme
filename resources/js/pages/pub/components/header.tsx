import AppearanceToggleDropdown from "@/components/appearance-dropdown";
import PrdlpLogo from "@/components/vectors/prdlp-logo";
import { useCatalogsStore } from "@/store/catalogs-store";
import { Link } from "@inertiajs/react";
import { Home, Phone } from "lucide-react";
interface Props {
  showHomeBtn?: Boolean
  showPhoneBtn?: Boolean
}
export default function Header({ showHomeBtn = true, showPhoneBtn = true }: Props) {
  const isDarkTheme = useCatalogsStore(state => state.isDarkTheme);
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-sky-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PrdlpLogo size={40} fill={isDarkTheme ? 'white' : 'blue'} />
          <div>
            <h1 className="text-lg font-bold text-sky-700 dark:text-sky-400 leading-tight">POLICLÍNICO REYNA DE LA PAZ</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Congregación Nuestra Señora de la Paz</p>
          </div>
        </div>
        <div className='flex gap-4'>
          {showPhoneBtn && (
            <a
              href="tel:+514519661"
              className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold active:bg-sky-700 transition-colors"
            >
              <Phone size={18} />
              <span className="hidden sm:inline">Llámanos</span>
            </a>
          )}
          {showHomeBtn && (
            <Link
              href={route('home')}
              className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold active:bg-sky-700 transition-colors"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
          )}
          <div>
                    <AppearanceToggleDropdown />
                  </div>
        </div>
      </div>
    </header>
  )
}
