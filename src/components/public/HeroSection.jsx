import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import portada from '../../assets/hero/portada-grafiplot.jpg.webp';
import yape from '../../assets/payments/yape.webp';
import plin from '../../assets/payments/plin.webp';
import lukita from '../../assets/payments/lukita.webp';

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-[95vh] flex items-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Fondo Adaptativo */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.03] dark:opacity-20 grayscale-[0.5] scale-105 transition-opacity duration-500"
          style={{ backgroundImage: `url(${portada})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center lg:text-left lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-brand-red dark:text-brand-yellow text-[10px] font-black tracking-[0.2em] uppercase mb-8 shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            Tienda Online Oficial
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-8 text-slate-900 dark:text-white"
          >
            GRAFIPLOT<br/>
            <span className="text-brand-red dark:text-brand-yellow italic drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(250,204,21,0.3)]">VASQUEZ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed font-light tracking-tight"
          >
            Elevamos tus ideas con <span className="text-slate-900 dark:text-white font-bold">impresiones de alta fidelidad</span>. Rapidez, calidad técnica y el mejor precio del mercado para tus proyectos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-5 mb-16"
          >
            <Link
              to="/register"
              className="group relative px-10 py-5 bg-brand-yellow dark:bg-brand-yellow text-slate-900 font-black text-xs tracking-[0.2em] rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-yellow/20 dark:shadow-brand-yellow/10 uppercase"
            >
              Ir a tienda online
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Link>
            
            <a
              href="https://wa.me/952628844?text=Hola%20ROY_VASQUES%2C%20quiero%20consultar%20un%20producto"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-black text-xs tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm flex items-center gap-3 uppercase"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              WhatsApp
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center lg:justify-start gap-8 opacity-40 dark:opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <img src={yape} alt="Yape" className="h-6 w-auto" />
            <img src={plin} alt="Plin" className="h-6 w-auto" />
            <img src={lukita} alt="Lukita" className="h-6 w-auto" />
          </motion.div>
        </div>
      </div>

      {/* Info Card Flotante (Anti-PPT) */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-80 bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border-none dark:border dark:border-white/10"
      >
        <div className="space-y-8">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-brand-red/5 dark:bg-brand-yellow/10 flex items-center justify-center border border-brand-red/10 dark:border-brand-yellow/20">
              <MapPin className="w-6 h-6 text-brand-red dark:text-brand-yellow" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-1">Local Principal</p>
              <p className="text-sm text-slate-900 dark:text-slate-200 font-bold leading-tight tracking-tight">Av. Universitaria 606, frente a la UNHEVAL</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">Horarios</p>
            <div className="text-xs space-y-2 font-medium">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Lunes - Viernes</span>
                <span className="text-slate-900 dark:text-white font-bold tracking-tighter">07:00 - 22:00</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Sábados</span>
                <span className="text-slate-900 dark:text-white font-bold tracking-tighter">08:00 - 22:00</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Domingos</span>
                <span className="text-slate-900 dark:text-white font-bold tracking-tighter">09:00 - 22:00</span>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 dark:border-white/5 text-center">
            <a 
              href="https://maps.app.goo.gl/xVdKmLRH2RPNoTJW9" 
              target="_blank" 
              className="text-xs font-black text-brand-red dark:text-brand-yellow hover:scale-105 transition-transform flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              Ver en Google Maps <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
