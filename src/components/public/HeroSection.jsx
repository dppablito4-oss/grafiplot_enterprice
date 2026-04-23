import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import portada from '../../assets/hero/portada-grafiplot.jpg.webp';
import yape from '../../assets/payments/yape.webp';
import plin from '../../assets/payments/plin.webp';
import lukita from '../../assets/payments/lukita.webp';

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
      {/* Fondo con imagen y overlay futurista */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 grayscale-[0.5] scale-105"
          style={{ backgroundImage: `url(${portada})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
        <div className="absolute inset-0 hero-gradient-overlay" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center lg:text-left lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-red text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-3 h-3 animate-pulse" />
            Tienda Online Oficial
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6"
          >
            <span className="block text-white">GRAFIPLOT</span>
            <span className="block text-brand-red italic drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">VASQUEZ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light"
          >
            Elevamos tus ideas al siguiente nivel con <span className="text-white font-medium">impresiones de alta fidelidad</span>, ploteos técnicos y acabados premium. Tecnología y rapidez a tu alcance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12"
          >
            <Link
              to="/register"
              className="group relative px-8 py-4 bg-brand-red rounded-full text-white font-bold text-sm tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                EMPEZAR PEDIDO <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            
            <a
              href="https://wa.me/952628844?text=Hola%20ROY_VASQUES%2C%20quiero%20consultar%20un%20producto"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-bold text-sm tracking-widest hover:bg-white/10 transition-all backdrop-blur-md flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              WHATSAPP
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center lg:justify-start gap-6 opacity-60 grayscale hover:grayscale-0 transition-all"
          >
            <img src={yape} alt="Yape" className="h-6 w-auto" />
            <img src={plin} alt="Plin" className="h-6 w-auto" />
            <img src={lukita} alt="Lukita" className="h-6 w-auto" />
          </motion.div>
        </div>
      </div>

      {/* Floating Info Card (Futuristic Style) */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 glass-panel p-6 rounded-3xl"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-red/20 flex items-center justify-center border border-brand-red/30">
              <MapPin className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Ubicación</p>
              <p className="text-xs text-slate-200 font-medium">Av. Universitaria 606, Huánuco</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Disponibilidad</p>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>L-V</span>
                <span className="text-white">07:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sáb</span>
                <span className="text-white">08:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Dom</span>
                <span className="text-white">09:00 - 22:00</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/10 text-center">
            <a 
              href="https://maps.app.goo.gl/xVdKmLRH2RPNoTJW9" 
              target="_blank" 
              className="text-xs font-bold text-brand-yellow hover:underline flex items-center justify-center gap-1"
            >
              Google Maps <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
