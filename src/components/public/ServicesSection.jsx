import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Scissors, Scan, Maximize2, FileText, Cpu, ChevronDown } from 'lucide-react';

// Imágenes de servicios (ilustraciones grandes)
import imgImpresion from '../../assets/services/mono-impresion.svg';
import imgPloteo from '../../assets/services/mono-diagrama.svg';
import imgAcabados from '../../assets/services/produccion.svg';
import imgDigitalizacion from '../../assets/services/mono-formato.svg';
import imgAPA from '../../assets/services/tesis.svg';
import imgSoporte from '../../assets/services/soporte.svg';

const services = [
  {
    id: 1,
    title: 'Impresión Alta Fidelidad',
    desc: 'Documentos, tesis y separatas con nitidez láser y colores vibrantes en diversos gramajes. Ideal para presentaciones profesionales y académicas.',
    icon: Printer,
    image: imgImpresion,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-600/5 dark:bg-blue-400/10',
    borderColor: 'border-blue-200 dark:border-blue-500/30'
  },
  {
    id: 2,
    title: 'Ploteo Técnico & Planos',
    desc: 'Precisión absoluta para ingeniería y arquitectura en tamaños A2, A1 y A0. Calidad de línea impecable para tus proyectos técnicos.',
    icon: Maximize2,
    image: imgPloteo,
    color: 'text-brand-red dark:text-brand-yellow',
    bg: 'bg-brand-red/5 dark:bg-brand-yellow/10',
    borderColor: 'border-brand-red/20 dark:border-brand-yellow/30'
  },
  {
    id: 3,
    title: 'Acabados Especiales',
    desc: 'Encuadernación, laminado y cortes de precisión para una presentación profesional. Dale el toque final perfecto a tus trabajos.',
    icon: Scissors,
    image: imgAcabados,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-600/5 dark:bg-amber-400/10',
    borderColor: 'border-amber-200 dark:border-amber-500/30'
  },
  {
    id: 4,
    title: 'Digitalización Inteligente',
    desc: 'Escaneo de alta resolución y conversión a formatos editables para tus archivos. Preserva tus documentos físicos en formato digital.',
    icon: Scan,
    image: imgDigitalizacion,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-600/5 dark:bg-emerald-400/10',
    borderColor: 'border-emerald-200 dark:border-emerald-500/30'
  },
  {
    id: 5,
    title: 'Normativa Académica APA',
    desc: 'Asesoría técnica en diagramación y márgenes según reglamentos universitarios. Asegura que tu tesis cumpla con todos los estándares.',
    icon: FileText,
    image: imgAPA,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-600/5 dark:bg-indigo-400/10',
    borderColor: 'border-indigo-200 dark:border-indigo-500/30'
  },
  {
    id: 6,
    title: 'Soporte y Hardware',
    desc: 'Mantenimiento, optimización y actualización de equipos para tu productividad. Servicio técnico de confianza para tus herramientas de trabajo.',
    icon: Cpu,
    image: imgSoporte,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-600/5 dark:bg-orange-400/10',
    borderColor: 'border-orange-200 dark:border-orange-500/30'
  },
];

export function ServicesSection() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const isExpanded = expandedId === service.id;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                key={service.id}
                onClick={() => toggleExpand(service.id)}
                className={`premium-card cursor-pointer overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl dark:shadow-none ${
                  isExpanded ? 'border-2 ' + service.borderColor : 'hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-1'
                }`}
              >
                <motion.div layout className="p-6 md:p-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 ${service.bg} rounded-[1.2rem] flex items-center justify-center transition-transform ${isExpanded ? 'scale-110' : ''}`}>
                      <service.icon className={`w-7 h-7 md:w-8 md:h-8 ${service.color}`} />
                    </div>
                    <h4 className={`text-lg md:text-2xl font-black tracking-tight leading-tight transition-colors ${
                      isExpanded ? service.color : 'text-slate-900 dark:text-white'
                    }`}>
                      {service.title}
                    </h4>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-400`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-8 pt-2">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start border-t border-slate-100 dark:border-white/10 pt-6">
                          <div className="flex-1 space-y-6">
                            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-light tracking-tight">
                              {service.desc}
                            </p>
                            <a 
                              href={`https://wa.me/952628844?text=Hola%2C%20quisiera%20consultar%20sobre%20el%20servicio%20de%20${encodeURIComponent(service.title)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black tracking-[0.1em] uppercase text-white transition-transform hover:scale-105 active:scale-95 ${
                                service.id === 2 ? 'bg-brand-red dark:bg-brand-yellow dark:text-slate-900' : 'bg-slate-900 dark:bg-white dark:text-slate-900'
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Consultar Servicio
                            </a>
                          </div>
                          <div className="w-full md:w-1/2 flex justify-center bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
                            <img 
                              src={service.image} 
                              alt={service.title} 
                              className="w-full max-w-[200px] h-auto object-contain dark:opacity-90"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
