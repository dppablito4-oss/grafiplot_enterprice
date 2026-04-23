import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Inicio', sectionId: 'inicio' },
  { label: 'Servicios', sectionId: 'servicios' },
  { label: 'Contacto', sectionId: 'contacto' },
];

export function PublicNavbar({ onNavigateSection }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#111827]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigateSection('inicio')}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded bg-brand-red font-bold text-white">
            G
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Grafiplot</span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <button
              key={item.sectionId}
              type="button"
              onClick={() => onNavigateSection(item.sectionId)}
              className="text-sm font-medium text-slate-200 transition-colors hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Iniciar sesion
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </header>
  );
}
