import { ShieldCheck, Clock3, Boxes, Handshake } from 'lucide-react';

const features = [
  {
    icon: Clock3,
    title: 'Rapido y seguro',
    text: 'Procesos optimizados para entregas urgentes sin comprometer calidad.',
  },
  {
    icon: Boxes,
    title: 'Grandes demandas',
    text: 'Capacidad de produccion para picos de pedidos empresariales.',
  },
  {
    icon: Handshake,
    title: 'Asesoria personalizada',
    text: 'Te guiamos en materiales, acabados y formatos para mejores resultados.',
  },
  {
    icon: ShieldCheck,
    title: 'Calidad garantizada',
    text: 'Control de color y terminacion profesional en cada trabajo.',
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-red">Ventajas</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Por que elegirnos</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-200 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-slate-100 p-3 text-brand-red">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
