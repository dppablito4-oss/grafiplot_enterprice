import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(15, 23, 42, 0.86), rgba(30, 41, 59, 0.65)), url('https://images.unsplash.com/photo-1587614203976-365c74645e83?auto=format&fit=crop&q=80&w=1800')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto flex min-h-[68vh] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          <p className="inline-flex rounded-full border border-white/30 px-4 py-1 text-sm font-medium text-white/90">
            Impresion digital y publicidad
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Soluciones integrales en imprenta y publicidad
          </h1>
          <p className="text-lg text-slate-200">
            Desde impresiones urgentes hasta campanas de gran formato. Calidad profesional, entregas
            rapidas y acompanamiento para tu negocio.
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
          </div>
        </div>
      </div>
    </section>
  );
}
