import { useMemo, useState } from 'react';
import { Carousel } from '../ui/Carousel';
import produccionIcon from '../../../assets/services/produccion.svg';
import tesisIcon from '../../../assets/services/tesis.svg';
import monograficoIcon from '../../../assets/services/monografico.svg';
import soporteIcon from '../../../assets/services/soporte.svg';
import monoFormatoIcon from '../../../assets/services/mono-formato.svg';
import monoCitasIcon from '../../../assets/services/mono-citas.svg';
import monoDiagramaIcon from '../../../assets/services/mono-diagrama.svg';
import monoImpresionIcon from '../../../assets/services/mono-impresion.svg';

const tabItems = [
  { key: 'produccion', title: 'Produccion y acabados', icon: produccionIcon },
  { key: 'tesis', title: 'Tesis y normas APA', icon: tesisIcon },
  { key: 'monograficos', title: 'Trabajos monograficos', icon: monograficoIcon },
  { key: 'soporte', title: 'Soporte tecnico PC', icon: soporteIcon },
];

const productionSlides = [
  {
    title: 'Copias para clases',
    description: 'Impresion rapida para apuntes y separatas.',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Impresion por volumen',
    description: 'Precios por mayor para documentos grandes.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200',
  },
  {
    title: 'Ploteos de alta nitidez',
    description: 'Planos y posters en formatos grandes.',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=1200',
  },
];

const quickProducts = [
  { title: 'Enmicado tamaño DNI', price: 'S/ 4.00' },
  { title: 'Enmicado tamaño A4', price: 'S/ 6.00' },
  { title: 'Escaneo A4', price: 'S/ 0.10' },
  { title: 'Quemado de DVD', price: 'S/ 2.50' },
];

const thesisFeatures = [
  {
    title: 'Formato APA 7ma',
    desc: 'Portada, margenes, indice, numeracion y estructura final.',
    icon: monoFormatoIcon,
  },
  {
    title: 'Ajustes academicos',
    desc: 'Correccion de citas, interlineado y tablas.',
    icon: monoCitasIcon,
  },
  {
    title: 'Revision visual final',
    desc: 'Documento listo para sustentar e imprimir.',
    icon: monoDiagramaIcon,
  },
];

const monographicFeatures = [
  {
    title: 'Formato academico',
    desc: 'Ajuste de portada, titulos y margenes.',
    icon: monoFormatoIcon,
  },
  {
    title: 'Citas y referencias',
    desc: 'Consistencia visual de APA y bibliografia.',
    icon: monoCitasIcon,
  },
  {
    title: 'Diagramacion Pro',
    desc: 'Tablas, graficos y limpieza para exposicion.',
    icon: monoDiagramaIcon,
  },
  {
    title: 'Impresion y espiralado',
    desc: 'Entrega final con acabado profesional.',
    icon: monoImpresionIcon,
  },
];

const supportFeatures = [
  { title: 'Limpieza profunda', price: 'Desde S/ 30.00' },
  { title: 'Cambio de pasta termica', price: 'Desde S/ 15.00' },
  { title: 'Optimizacion de sistema', price: 'Desde S/ 35.00' },
  { title: 'Formateo e instalacion', price: 'Desde S/ 25.00' },
];

export function ServicesSection() {
  const [activeTab, setActiveTab] = useState('produccion');

  const activeTabTitle = useMemo(
    () => tabItems.find((item) => item.key === activeTab)?.title ?? 'Servicios',
    [activeTab]
  );

  return (
    <section id="servicios" className="bg-[#f8fafc] py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-red">Servicios</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Produccion grafica para cada necesidad
          </h2>
        </div>

        <div className="mb-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                activeTab === tab.key
                  ? 'border-brand-red bg-red-50 text-brand-red'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <img src={tab.icon} alt={tab.title} className="h-10 w-10 rounded-md bg-white p-1" />
              <span className="text-sm font-semibold">{tab.title}</span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-2xl font-bold text-slate-900">{activeTabTitle}</h3>

          {activeTab === 'produccion' && (
            <div className="space-y-8">
              <Carousel items={productionSlides} />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quickProducts.map((item) => (
                  <article key={item.title} className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">Servicio rapido</p>
                    <h4 className="mt-2 font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-2 text-sm font-bold text-brand-red">{item.price}</p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tesis' && (
            <div className="grid gap-4 md:grid-cols-3">
              {thesisFeatures.map((item) => (
                <article key={item.title} className="rounded-xl border border-slate-200 p-4">
                  <img src={item.icon} alt={item.title} className="h-14 w-14" />
                  <h4 className="mt-3 font-semibold text-slate-900">{item.title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'monograficos' && (
            <div className="grid gap-4 md:grid-cols-2">
              {monographicFeatures.map((item) => (
                <article key={item.title} className="flex gap-3 rounded-xl border border-slate-200 p-4">
                  <img src={item.icon} alt={item.title} className="h-12 w-12 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'soporte' && (
            <div className="grid gap-4 md:grid-cols-2">
              {supportFeatures.map((item) => (
                <article key={item.title} className="rounded-xl border border-slate-200 p-4">
                  <h4 className="font-semibold text-slate-900">{item.title}</h4>
                  <p className="mt-2 text-sm text-slate-500">{item.price}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
