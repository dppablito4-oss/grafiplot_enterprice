import { Link } from 'react-router-dom';

export function PublicFooter() {
  return (
    <footer id="contacto" className="bg-slate-950 py-16 text-slate-200 border-t border-white/5">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-white tracking-tighter italic">GRAFIPLOT <span className="text-brand-red">VASQUEZ</span></h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Impresiones, ploteos y acabados con atencion extendida para trabajos academicos y profesionales.
          </p>
        </div>

        <div>
          <h4 className="mb-6 font-bold text-white uppercase tracking-widest text-xs">Contacto</h4>
          <div className="space-y-4 text-sm text-slate-300">
            <p><strong className="text-white block">WhatsApp:</strong> 952 628 844</p>
            <p><strong className="text-white block">Direccion:</strong> Av. Universitaria 606, frente a la puerta principal de la UNHEVAL</p>
            <p><strong className="text-white block">Horario:</strong> lun-vie 7am-10pm | sab 8am-10pm | dom 9am-10pm</p>
          </div>
        </div>

        <div>
          <h4 className="mb-6 font-bold text-white uppercase tracking-widest text-xs">Accesos rapidos</h4>
          <div className="flex flex-col gap-3 text-sm">
            <a href="https://maps.app.goo.gl/xVdKmLRH2RPNoTJW9" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">Ver ubicacion en mapa</a>
            <a href="https://wa.me/952628844?text=Hola%20ROY_VASQUES%2C%20quiero%20consultar%20un%20producto" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Consultar por WhatsApp</a>
            <Link to="/login" className="hover:text-white transition-colors">Ir al panel de pedidos</Link>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h4 className="mb-4 font-bold text-white uppercase tracking-widest text-xs text-brand-red">Desarrollo Web</h4>
          <div className="space-y-3 text-xs text-slate-400">
            <p>Developed by <span className="text-white font-bold">Samuel Y. Pablo Claudio</span></p>
            <p className="opacity-60 italic">Diseño y desarrollo de la página web oficial.</p>
            <a 
              href="https://wa.me/918165428?text=Hola%20SAMUEL%20PABLO%2C%20vengo%20de%20la%20web%20de%20Grafiplot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2 font-bold text-white bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-all"
            >
              CONTACTO AL DEVELOPER
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 w-full max-w-7xl border-t border-white/5 px-4 pt-8 text-[10px] text-slate-500 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between gap-4 uppercase tracking-[0.2em]">
        <p>© 2026 Grafiplot Vasquez. Todos los derechos reservados.</p>
        <p>Propietario: <strong className="text-slate-300">Roy Vasquez Palpa y Samuel Y. Pablo Claudio</strong></p>
      </div>
    </footer>
  );
}
