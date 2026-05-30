import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { servicesData } from '../../data/servicesData';

function ServiceCard({ service, reverse }) {
  const cardRef = useRef(null);

  const direction = reverse ? 100 : -100;

  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ x: direction, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="group block"
    >
      <Link
        to={`/servicios/${service.id}`}
        className="block"
      >
        {/* === RECUADRO DE TEXTO === */}
        <div
          className="relative rounded-2xl md:rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 
            bg-white dark:bg-[#141414] transition-shadow duration-500 
            group-hover:shadow-xl group-hover:shadow-slate-900/5 dark:group-hover:shadow-black/20 z-10"
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

        {/* === IMAGEN === */}
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="relative mt-[-1px] mx-4 md:mx-8 rounded-b-2xl md:rounded-b-3xl overflow-hidden"
        >
          <div 
            className="relative bg-gradient-to-b from-slate-100 to-slate-50 dark:from-[#1a1a1a] dark:to-[#111] 
              border border-t-0 border-slate-200 dark:border-white/10 
              rounded-b-2xl md:rounded-b-3xl overflow-hidden
              p-6 md:p-10 flex items-center justify-center min-h-[200px] md:min-h-[280px]"
          >
            <motion.img
              initial={{ y: 50, scale: 1.1 }}
              whileInView={{ y: -10, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              whileHover={{ x: [0, 5, -5, 0], transition: { duration: 0.5 } }}
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
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function ServicesSection() {
  return (
    <section id="servicios" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
            SOLUCIONES CON <span className="text-brand-red dark:text-brand-yellow italic">PRECISIÓN</span>
          </h3>
        </motion.div>

        {/* Servicios */}
        <div className="flex flex-col gap-12 md:gap-16 max-w-4xl mx-auto">
          {servicesData.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              reverse={i % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
