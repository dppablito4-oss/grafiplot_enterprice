import { Link } from 'react-router-dom';
import { MapPin, MessageCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="inicio" className="bg-slate-950">
      <div className="overflow-hidden border-y border-white/10 bg-slate-900/60 py-2">
        <div className="mx-auto flex w-full max-w-7xl gap-6 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-wide text-slate-300 sm:px-6 lg:px-8">
          <span>Nosotros lo imprimimos al toque</span>
          <span>Ploteos y acabados con entrega rapida</span>
          <span>Atencion de lunes a domingo</span>
        </div>
      </div>
      <div
        className="relative isolate overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7)), url('https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&q=80&w=1800')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto flex min-h-[68vh] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
          <p className="inline-flex rounded-full border border-white/30 px-4 py-1 text-sm font-medium text-white/90">
            Tienda online oficial
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Soluciones integrales en imprenta y publicidad
          </h1>
          <p className="text-lg text-slate-200">
            Impresiones, ploteos y acabados para trabajos academicos y de negocio. Atencion extendida
            toda la semana con precios competitivos.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              Solicitar asesoria
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ingresar al panel
            </Link>
            <a
              href="https://wa.me/952628844?text=Hola%20Grafiplot%2C%20quiero%20consultar%20un%20producto"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 px-6 py-3 text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/10"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp directo
            </a>
          </div>
          <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-200">
            <p>Horario: lun-vie 7am-10pm | sab 8am-10pm | dom 9am-10pm</p>
            <p>Direccion: Av. Universitaria 606 frente a la puerta principal de la UNHEVAL</p>
            <a
              href="https://maps.app.goo.gl/xVdKmLRH2RPNoTJW9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-brand-yellow"
            >
              <MapPin className="h-4 w-4" />
              Ver ubicacion en mapa
            </a>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
