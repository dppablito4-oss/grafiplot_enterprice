import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { servicesData } from '../../data/servicesData';

gsap.registerPlugin(ScrollTrigger);

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const isFirstRender = useRef(true);

  const activeService = servicesData[activeIndex];

  useEffect(() => {
    // No animar en el primer render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const ctx = gsap.context(() => {
      // Timeline: imagen entra desde la izquierda, texto desde la derecha
      const tl = gsap.timeline();

      tl.fromTo(
        imageRef.current,
        { x: -80, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
      );

      tl.fromTo(
        textRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        '-=0.35' // Se superpone ligeramente con la animación de la imagen
      );
    }, contentRef);

    return () => ctx.revert();
  }, [activeIndex]);

  return (
    <section id="servicios" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
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

        {/* Recuadros de Títulos - Grid 2 columnas en desktop, scroll horizontal en móvil */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-10 md:mb-14 max-w-5xl mx-auto">
          {servicesData.map((service, index) => {
            const isActive = activeIndex === index;
            const Icon = service.icon;

            return (
              <button
                key={service.id}
                onClick={() => setActiveIndex(index)}
                className={`relative group text-left p-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'border-slate-900 dark:border-brand-yellow bg-slate-900 dark:bg-brand-yellow/10 shadow-xl'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-400 dark:hover:border-white/20 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-lg md:rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? 'bg-white/20 dark:bg-brand-yellow/20' : service.bg
                  }`}>
                    <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-white dark:text-brand-yellow' : service.color}`} />
                  </div>
                  <span className={`text-xs md:text-sm font-black tracking-tight leading-tight transition-colors ${
                    isActive ? 'text-white dark:text-brand-yellow' : 'text-slate-900 dark:text-white'
                  }`}>
                    {service.title}
                  </span>
                </div>

                {/* Indicador activo */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-red dark:bg-brand-yellow" />
                )}
              </button>
            );
          })}
        </div>

        {/* Panel de Contenido - Imagen + Descripción con animación GSAP */}
        <div
          ref={contentRef}
          className="max-w-5xl mx-auto bg-white dark:bg-[#111] rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm"
        >
          <div className="flex flex-col md:flex-row">
            {/* Imagen - Entra desde la izquierda */}
            <div
              ref={imageRef}
              className="w-full md:w-2/5 bg-slate-50 dark:bg-white/5 flex items-center justify-center p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5"
            >
              <img
                src={activeService.image}
                alt={activeService.title}
                className="w-full max-w-[180px] md:max-w-[240px] h-auto object-contain dark:opacity-85"
              />
            </div>

            {/* Texto - Entra desde la derecha */}
            <div
              ref={textRef}
              className="flex-1 p-6 md:p-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${activeService.bg} rounded-xl flex items-center justify-center`}>
                    <activeService.icon className={`w-5 h-5 ${activeService.color}`} />
                  </div>
                  <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                    {activeService.title}
                  </h4>
                </div>

                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-light mb-6">
                  {activeService.fullDesc}
                </p>

                {/* Features rápidos */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {activeService.features.slice(0, 3).map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 uppercase tracking-wider"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link
                  to={`/servicios/${activeService.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-brand-yellow text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-md"
                >
                  Ver Detalles y Precios
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`https://wa.me/952628844?text=Hola%2C%20quisiera%20consultar%20sobre%20el%20servicio%20de%20${encodeURIComponent(activeService.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
