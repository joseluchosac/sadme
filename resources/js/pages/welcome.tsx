import useService from '@/hooks/use-service';
import { useCatalogsStore } from '@/store/catalogs-store';
import { AffectationType, Category, SharedData, Unit } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, Phone, MapPin, Mail, Stethoscope, Syringe, ScanEye } from 'lucide-react';
import { useEffect } from 'react';
import Header from './pub/components/header';
import FacebookLogo from '@/components/vectors/fecebook-logo';
import PrdlpLogo from '@/components/vectors/prdlp-logo';

const services = [
  { icon: Stethoscope, name: 'Consultas Médicas', description: 'Atención médica integral para toda la familia' },
  { icon: Syringe, name: 'Laboratorio', description: 'Análisis clínicos y exámenes de laboratorio' },
  { icon: ScanEye, name: 'Imágenes', description: 'Diagnóstico por imágenes: Ecografía, Rayos X' },
];

const schedule = [
  { day: 'Lunes - Sábado', hours: '06:30 am - 08:00 pm' },
];

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const {
    isDarkTheme,
    categories,
    setCategories,
    units,
    setUnits,
    affectationTypes,
    setAffectationTypes,
  } = useCatalogsStore(state => state);

  const { getCategories, data: categoriesData } = useService<Category[]>()
  const { getUnits, data: unitsData } = useService<Unit[]>()
  const { getAffectationTypes, data: affectationTypesData } = useService<AffectationType[]>()

  useEffect(() => {
    if (!categories) getCategories();
    if (!units) getUnits();
    if (!affectationTypes) getAffectationTypes();
  }, []);

  useEffect(() => {
    if (!categoriesData) return;
    setCategories(categoriesData)
  }, [categoriesData]);
  useEffect(() => {
    if (!unitsData) return;
    setUnits(unitsData)
  }, [unitsData]);
  useEffect(() => {
    if (!affectationTypesData) return;
    setAffectationTypes(affectationTypesData)
  }, [affectationTypesData]);

  return (
    <>
      <Head title="Inicio" />
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">

        {/* Header */}
        <Header showHomeBtn={false} showPhoneBtn={false} />

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20 text-center">
            <div className='flex justify-center'>
              <PrdlpLogo size={150} fill={isDarkTheme ? 'white' : 'blue'} />
            </div>
            {/* <div className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Heart size={14} className="fill-current" />
              Tu salud es nuestra prioridad
            </div> */}
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              Cuidamos de ti y<br />
              <span className="text-sky-600 dark:text-sky-400">tu familia</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl mx-auto mb-8">
              Contamos con profesionales especializados y tecnología de vanguardia para brindarte la mejor atención.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-8 py-4 rounded-2xl text-lg font-bold active:bg-sky-700 transition-colors shadow-lg shadow-sky-600/25"
              >
                Especialidades
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-8 py-4 rounded-2xl text-lg font-bold active:bg-sky-700 transition-colors shadow-lg shadow-sky-600/25"
              >
                Servicios
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 border-2 border-sky-200 dark:border-gray-700 px-8 py-4 rounded-2xl text-lg font-bold active:bg-sky-50 dark:active:bg-gray-700 transition-colors"
              >
                <Clock size={20} />
                Horarios
              </a>
              <Link
                href={route('pub.precios')}
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 border-2 border-sky-200 dark:border-gray-700 px-8 py-4 rounded-2xl text-lg font-bold active:bg-sky-50 dark:active:bg-gray-700 transition-colors"
              >
                <span>S/</span>
                Precios
              </Link>

            </div>
          </div>
        </section>

        {/* Services */}
        <section id="servicios" className="max-w-6xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Nuestros Servicios</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Toca un servicio para más información</p>
          <div className="flex flex-wrap justify-center gap-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="w-60 group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 text-center active:scale-95 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:border-sky-200 dark:hover:border-sky-700"
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-sky-50 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center group-active:bg-sky-100 dark:group-active:bg-sky-800/40 transition-colors">
                  <service.icon className="text-sky-600 dark:text-sky-400" size={26} />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{service.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Schedule */}
        <section id="horarios" className="max-w-6xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Horario de Atención</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Estamos para servirte</p>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden max-w-lg mx-auto shadow-sm">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between px-6 py-4 ${idx !== schedule.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-sky-500 dark:text-sky-400 shrink-0" />
                  <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{item.day}</span>
                </div>
                <span className="text-sm font-bold text-sky-700 dark:text-sky-300">{item.hours}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Contáctanos</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Estamos cerca de ti</p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Dirección */}
            <div className="w-60 flex flex-col items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <MapPin className="text-orange-500 dark:text-orange-400" size={22} />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dirección</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm">Av. Elmer Faucet 472, Reynoso, Callao</p>
              </div>
            </div>
            {/* Teléfono */}
            <a
              href="tel:+51965055510"
              className="w-60 flex flex-col items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
            >
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Phone className="text-green-600 dark:text-green-400" size={22} />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Teléfono</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm">+51 965 055 510</p>
              </div>
            </a>
            {/* Email */}
            <a
              href="mailto:info@centromedico.com"
              className="w-60 flex flex-col items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
            >
              <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
                <Mail className="text-sky-600 dark:text-sky-400" size={22} />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm">info@policlínico.com</p>
              </div>
            </a>
            {/* Facebook */}
            <a
              href="https://www.facebook.com/reynadelapazcallao/"
              target='_blank'
              className="w-60 flex flex-col items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
            >
              <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 rounded-full flex items-center justify-center">
                <FacebookLogo size={24} fill='#0866ff' />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Facebook</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm">reynadelapazcallao</p>
              </div>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-8">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-bold text-sky-700 dark:text-sky-400">POLICLÍNICO REYNA DE LA PAZ</span>
            </div>
            {/* <p className="text-xs text-gray-400 dark:text-gray-500">&copy; 2026 Todos los derechos reservados</p> */}
            <p className="text-xs text-gray-400 dark:text-gray-500">Congregación Nuestra Señora de la Paz</p>
          </div>
        </footer>

      </div>
    </>
  );
}
