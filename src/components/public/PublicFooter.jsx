import { Link } from 'react-router-dom';

export function PublicFooter() {
  return (
    <footer id="contacto" className="bg-slate-950 py-14 text-slate-200">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Grafiplot</h3>
          <p className="text-sm text-slate-400">
            Soluciones de imprenta y publicidad para negocios que necesitan velocidad y calidad.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Navegacion</h4>
          <div className="space-y-2 text-sm">
            <p>Inicio</p>
            <p>Servicios</p>
            <p>Contacto</p>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Contacto</h4>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Av. Principal 123, Cochabamba</p>
            <p>+591 700 00000</p>
            <p>ventas@grafiplot.com</p>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Cuenta</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/login" className="hover:text-white">
              Iniciar sesion
            </Link>
            <Link to="/register" className="hover:text-white">
              Crear cuenta
            </Link>
            <a
              href="https://wa.me/952628844?text=Hola%20Grafiplot%2C%20quiero%20consultar%20un%20producto"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 w-full max-w-7xl border-t border-slate-800 px-4 pt-6 text-xs text-slate-500 sm:px-6 lg:px-8">
        <p>© 2026 Grafiplot Vasquez. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
