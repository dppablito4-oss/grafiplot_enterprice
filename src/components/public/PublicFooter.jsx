import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import logo from '../../assets/brand/grafiplot-logo.webp';

export function PublicFooter() {
  return (
    <footer id="contacto" className="bg-slate-950 border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-red/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl p-1.5 flex items-center justify-center shadow-2xl">
                <img src={logo} alt="Grafiplot Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter italic leading-none">GRAFIPLOT</h3>
                <span className="text-[10px] font-bold text-brand-red tracking-[0.4em] uppercase">Vasquez</span>
              </div>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed font-light">
              Redefiniendo los estándares de impresión y ploteo en Huánuco. Tecnología de vanguardia para proyectos de ingeniería, arquitectura y academia.
            </p>
            <div className="flex gap-4">
              {/* Redes sociales (Placeholders con estilo) */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                  <ExternalLink className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-8">Ecosistema</h4>
            <ul className="space-y-4">
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-light">Acceso a Clientes</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors text-sm font-light">Registrar nuevo Usuario</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-light">Cotización Online</a></li>
            </ul>
          </div>

          {/* Contact Data */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-8">Centro de Control</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <MapPin className="w-5 h-5 text-brand-red shrink-0" />
                <p className="text-sm text-slate-400 font-light group-hover:text-white transition-colors leading-relaxed">
                  Av. Universitaria 606, frente a la puerta principal de la UNHEVAL, Huánuco, Perú.
                </p>
              </div>
              <div className="flex items-center gap-4 group">
                <Phone className="w-5 h-5 text-brand-red shrink-0" />
                <p className="text-sm text-slate-400 font-light group-hover:text-white transition-colors">
                  +51 952 628 844
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <Clock className="w-5 h-5 text-brand-red shrink-0" />
                <p className="text-sm text-slate-400 font-light group-hover:text-white transition-colors leading-relaxed">
                  Lunes - Viernes: 07:00 - 22:00<br/>
                  Fines de Semana: 08:00 - 22:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">
            © 2026 GRAFIPLOT VASQUEZ. ALL RIGHTS RESERVED.
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Architected by</p>
            <a 
              href="https://wa.me/918165428" 
              target="_blank" 
              className="text-xs font-black text-white hover:text-brand-red transition-colors flex items-center gap-2 group"
            >
              SAMUEL Y. PABLO CLAUDIO <div className="w-4 h-[1px] bg-brand-red group-hover:w-8 transition-all" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
