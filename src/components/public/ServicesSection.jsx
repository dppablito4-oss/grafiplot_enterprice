import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { servicesData } from '../../data/servicesData';

gsap.registerPlugin(ScrollTrigger);

function ServiceCard({ service, index, reverse }) {
  const cardRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const direction = reverse ? 100 : -100;

      // 1. El recuadro de texto entra desde izquierda/derecha
      gsap.fromTo(cardRef.current,
        { x: direction, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );

      // 2. Persiana enrollable — se abre al 100% cuando el card está centrado
      gsap.fromTo(imageWrapRef.current,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
            end: 'top 10%',
            scrub: 0.8,
          }
        }
      );

      // 3. La imagen en sí sube ligeramente (parallax inverso) mientras se revela
      gsap.fromTo(imageRef.current,
        { y: 50, scale: 1.1 },
        {
          y: -30, scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,               // misma suavidad que la cortina
          }
        }
      );

    }, cardRef);

    return () => ctx.revert();
  }, [reverse]);

  // Mouse tracking en la imagen
  const handleMouseMove = (e) => {
    if (!imageRef.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
    gsap.to(imageRef.current, { x, duration: 0.4, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  };

  const Icon = service.icon;

  return (
    <Link
      to={`/servicios/${service.id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group block opacity-0"
    >
      {/* === RECUADRO DE TEXTO === */}
      <div
        className="relative rounded-2xl md:rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 
          bg-white dark:bg-[#141414] transition-shadow duration-500 
          group-hover:shadow-xl group-hover:shadow-slate-900/5 dark:group-hover:shadow-black/20"
      >
        <div className={`flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 ${reverse ? 'md:flex-row-reverse md:text-right' : ''}`}>
          <div className={`w-12 h-12 ${service.bg} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
            <Icon className={`w-6 h-6 ${service.color}`} />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-brand-red dark:group-hover:text-brand-yellow transition-colors duration-300">
              {service.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
              {service.shortDesc}
            </p>
          </div>
          <div className={`flex items-center gap-2 shrink-0 ${reverse ? 'md:mr-auto' : 'md:ml-auto'}`}>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-brand-red dark:group-hover:text-brand-yellow transition-colors duration-300">
              Ver más
            </span>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-red dark:group-hover:text-brand-yellow group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </div>

      {/* === IMAGEN — Se revela como persiana enrollable === */}
      <div
        ref={imageWrapRef}
        className="relative mt-[-1px] mx-4 md:mx-8 rounded-b-2xl md:rounded-b-3xl overflow-hidden"
        style={{ clipPath: 'inset(0 0 100% 0)' }}
      >
        <div 
          className="relative bg-gradient-to-b from-slate-100 to-slate-50 dark:from-[#1a1a1a] dark:to-[#111] 
            border border-t-0 border-slate-200 dark:border-white/10 
            rounded-b-2xl md:rounded-b-3xl overflow-hidden
            p-6 md:p-10 flex items-center justify-center min-h-[200px] md:min-h-[280px]"
        >
          <img
            ref={imageRef}
            src={service.image}
            alt={service.title}
            className="w-[160px] md:w-[260px] h-auto object-contain drop-shadow-xl dark:opacity-85
              group-hover:drop-shadow-2xl transition-all duration-700"
          />

          {/* Overlay decorativo con el color del servicio */}
          <div 
            className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700"
            style={{ background: `radial-gradient(circle at 50% 50%, ${service.accentHex}, transparent 70%)` }}
          />
        </div>
      </div>
    </Link>
  );
}

export function ServicesSection() {
  const titleRef = useRef(null);

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
        {/* Header */}
        <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-16 md:mb-20 opacity-0">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
            Catálogo Interactivo
          </div>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
            SOLUCIONES CON <span className="text-brand-red dark:text-brand-yellow italic">PRECISIÓN</span>
          </h3>
        </div>

        {/* Servicios */}
        <div className="flex flex-col gap-12 md:gap-16 max-w-4xl mx-auto">
          {servicesData.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              reverse={i % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
