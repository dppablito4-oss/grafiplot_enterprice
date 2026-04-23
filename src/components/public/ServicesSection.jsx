import { Printer, ScanLine, PenTool, ImagePlus } from 'lucide-react';

const services = [
  {
    title: 'Impresion digital',
    description: 'Documentos, brochures y material comercial en alta definicion.',
    image:
      'https://images.unsplash.com/photo-1587613994564-967f1f672d14?auto=format&fit=crop&q=80&w=800',
    icon: Printer,
  },
  {
    title: 'Ploteos y planos',
    description: 'Ploteos tecnicos y arquitectonicos en formatos A0, A1 y A2.',
    image:
      'https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&q=80&w=800',
    icon: PenTool,
  },
  {
    title: 'Gigantografias',
    description: 'Lonas, vinilos y piezas de gran formato para alto impacto visual.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&q=80&w=800',
    icon: ImagePlus,
  },
  {
    title: 'Escaneo profesional',
    description: 'Digitalizacion de documentos con calidad y control de archivos.',
    image:
      'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&q=80&w=800',
    icon: ScanLine,
  },
];

export function ServicesSection() {
  return (
    <section id="servicios" className="bg-[#f8fafc] py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-red">Servicios</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Produccion grafica para cada necesidad
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1"
            >
              <img src={service.image} alt={service.title} className="h-48 w-full object-cover" />
              <div className="space-y-3 p-5">
                <div className="inline-flex rounded-lg bg-red-50 p-2 text-brand-red">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                <p className="text-sm text-slate-600">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
