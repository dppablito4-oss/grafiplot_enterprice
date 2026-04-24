import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import logo from '../../assets/brand/grafiplot-logo.webp';

export function PublicFooter() {
  return (
    <footer id="contacto" className="bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-white/5 pt-12 pb-8 transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-10">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl p-2 flex items-center justify-center shadow-xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-white/10">
                <img src={logo} alt="Grafiplot Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none">GRAFIPLOT</h3>
                <span className="text-xs font-bold text-brand-red tracking-[0.4em] uppercase">Vasquez</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg leading-relaxed font-light tracking-tight">
              Liderando la industria de la impresión en Huánuco con tecnología de precisión y atención personalizada.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-slate-900 dark:text-white font-black text-xs tracking-[0.3em] uppercase mb-6">Plataforma</h4>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-brand-yellow transition-colors text-sm font-bold tracking-tight uppercase">Acceso Clientes</Link></li>
              <li><Link to="/register" className="text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-brand-yellow transition-colors text-sm font-bold tracking-tight uppercase">Registrarse</Link></li>
              <li><Link to="/terminos" className="text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-brand-yellow transition-colors text-sm font-bold tracking-tight uppercase">Términos y Privacidad (IA)</Link></li>
            </ul>
          </div>

          {/* Contact Data */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-slate-900 dark:text-white font-black text-xs tracking-[0.3em] uppercase mb-6">Atención Directa</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-5 group">
                <MapPin className="w-6 h-6 text-brand-red dark:text-brand-yellow shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-relaxed tracking-tight">
                  Av. Universitaria 606, frente a la puerta principal de la UNHEVAL, Huánuco.
                </p>
              </div>
              <div className="flex items-center gap-5 group">
                <Phone className="w-6 h-6 text-brand-red dark:text-brand-yellow shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-black group-hover:text-slate-900 dark:group-hover:text-white transition-colors tracking-widest uppercase">
                  952 628 844
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-[0.4em]">
            © 2026 GRAFIPLOT VASQUEZ.
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">Designed & Developed by</p>
            <a 
              href="https://wa.me/918165428" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-black text-slate-900 dark:text-white hover:text-brand-red dark:hover:text-brand-yellow transition-colors flex items-center gap-3 group tracking-tighter"
            >
              PABLITO DP <div className="w-6 h-[2px] bg-brand-red dark:bg-brand-yellow group-hover:w-10 transition-all" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
