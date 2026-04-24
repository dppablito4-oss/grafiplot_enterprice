import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { servicesData } from '../../data/servicesData';

gsap.registerPlugin(ScrollTrigger);

function ServiceCard({ service, index, reverse }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card entra desde izquierda o derecha según posición
      const direction = reverse ? 100 : -100;

      gsap.fromTo(cardRef.current,
        { x: direction, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none none',
          }
        }
      );

      // La imagen hace zoom-in con delay
      gsap.fromTo(imageRef.current,
        { scale: 0.7, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );

      // Parallax de la imagen al hacer scroll
      gsap.to(imageRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

    }, cardRef);

    return () => ctx.revert();
  }, [reverse]);

  // Mouse tracking suave en la imagen
  const handleMouseMove = (e) => {
    if (!imageRef.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    gsap.to(imageRef.current, { x, y, duration: 0.5, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  };

  const Icon = service.icon;

  return (
    <Link
      to={`/servicios/${service.id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group block relative overflow-hidden rounded-3xl p-6 md:p-8 min-h-[320px] md:min-h-[360px] opacity-0
        border border-slate-200/50 dark:border-white/10
        transition-shadow duration-500 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-black/30`}
      style={{
        background: `linear-gradient(135deg, ${service.accentHex}08 0%, ${service.accentHex}15 50%, ${service.accentHex}05 100%)`,
      }}
    >
      {/* Fondo gradiente animado al hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${service.accentHex}12 0%, ${service.accentHex}20 100%)`,
        }}
      />

      <div className={`relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 h-full ${reverse ? 'md:flex-row-reverse' : ''}`}>
        {/* Texto */}
        <div ref={textRef} className="flex-1 flex flex-col justify-center space-y-4">
          <div className={`w-12 h-12 ${service.bg} rounded-2xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${service.color}`} />
          </div>
          <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {service.title}
          </h4>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-light max-w-md">
            {service.shortDesc}
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-900 dark:text-white group-hover:text-brand-red dark:group-hover:text-brand-yellow transition-colors">
              Conocer más
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-red dark:group-hover:text-brand-yellow group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>

        {/* Imagen */}
        <div className="w-full md:w-2/5 flex justify-center items-center shrink-0">
          <img
            ref={imageRef}
            src={service.image}
            alt={service.title}
            className="w-[140px] md:w-[220px] h-auto object-contain drop-shadow-lg dark:opacity-85
              group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </Link>
  );
}

export function ServicesSection() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="servicios" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header con fadeInUp */}
        <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-16 md:mb-20 opacity-0">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
            Catálogo Interactivo
          </div>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
            SOLUCIONES CON <span className="text-brand-red dark:text-brand-yellow italic">PRECISIÓN</span>
          </h3>
        </div>

        {/* Grid de servicios: alternan dirección como Innoverplot */}
        <div className="flex flex-col gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Fila 1: dos cards lado a lado en desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <ServiceCard service={servicesData[0]} index={0} reverse={false} />
            <ServiceCard service={servicesData[1]} index={1} reverse={true} />
          </div>

          {/* Fila 2: cards más grandes, una por fila, alternando lados */}
          {servicesData.slice(2).map((service, i) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={i + 2} 
              reverse={i % 2 !== 0} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
