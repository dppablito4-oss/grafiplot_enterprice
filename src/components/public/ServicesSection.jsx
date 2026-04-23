import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '../../data/servicesData';

gsap.registerPlugin(ScrollTrigger);

function ServiceCard({ service, index }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        y: '-25%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Link
        to={`/servicios/${service.id}`}
        ref={containerRef}
        className="block group relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 h-72 md:h-80 bg-white dark:bg-[#111] transition-all duration-500 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-white/5 hover:-translate-y-1"
      >
        {/* Imagen de fondo con efecto parallax GSAP */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl md:rounded-3xl">
          <div
            ref={imageRef}
            className="absolute -bottom-12 left-0 w-full h-[150%] bg-cover bg-center opacity-15 dark:opacity-10 group-hover:opacity-25 dark:group-hover:opacity-20 transition-opacity duration-700"
            style={{ backgroundImage: `url(${service.image})` }}
          />
          {/* Gradiente overlay para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#111] dark:via-[#111]/80 dark:to-transparent" />
        </div>

        {/* Contenido de la tarjeta - Plano superior */}
        <div className="relative z-20 h-full p-6 md:p-8 flex flex-col justify-between">
          {/* Top: Icono + Badge */}
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 md:w-14 md:h-14 ${service.bg} rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              <service.icon className={`w-6 h-6 md:w-7 md:h-7 ${service.color}`} />
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-white" />
            </div>
          </div>

          {/* Bottom: Título + Desc */}
          <div className="space-y-2">
            <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-brand-red dark:group-hover:text-brand-yellow transition-colors duration-300">
              {service.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
              {service.shortDesc}
            </p>

            {/* Línea de acento animada */}
            <div className="flex items-center gap-2 pt-2">
              <div
                className="h-[2px] w-8 group-hover:w-16 transition-all duration-500 rounded-full"
                style={{ backgroundColor: service.accentHex }}
              />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                Ver detalles
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ServicesSection() {
  return (
    <section id="servicios" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6"
          >
            Catálogo Interactivo
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase"
          >
            SOLUCIONES CON <span className="text-brand-red dark:text-brand-yellow italic">PRECISIÓN</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-7xl mx-auto">
          {servicesData.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
