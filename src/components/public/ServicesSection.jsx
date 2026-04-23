import { motion } from 'framer-motion';
import { Printer, Scissors, Scan, Maximize2, FileText, Cpu, ArrowUpRight } from 'lucide-react';

const services = [
  {
    title: 'Impresión Alta Fidelidad',
    desc: 'Documentos, tesis y separatas con nitidez láser y colores vibrantes en diversos gramajes.',
    icon: Printer,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-600/5 dark:bg-blue-400/10',
  },
  {
    title: 'Ploteo Técnico & Planos',
    desc: 'Precisión absoluta para ingeniería y arquitectura en tamaños A2, A1 y A0.',
    icon: Maximize2,
    color: 'text-brand-red dark:text-brand-yellow',
    bg: 'bg-brand-red/5 dark:bg-brand-yellow/10',
  },
  {
    title: 'Acabados Especiales',
    desc: 'Encuadernación, laminado y cortes de precisión para una presentación profesional.',
    icon: Scissors,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-600/5 dark:bg-amber-400/10',
  },
  {
    title: 'Digitalización Inteligente',
    desc: 'Escaneo de alta resolución y conversión a formatos editables para tus archivos.',
    icon: Scan,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-600/5 dark:bg-emerald-400/10',
  },
  {
    title: 'Normativa Académica APA',
    desc: 'Asesoría técnica en diagramación y márgenes según reglamentos universitarios.',
    icon: FileText,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-600/5 dark:bg-indigo-400/10',
  },
  {
    title: 'Soporte y Hardware',
    desc: 'Mantenimiento, optimización y actualización de equipos para tu productividad.',
    icon: Cpu,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-600/5 dark:bg-orange-400/10',
  },
];

export function ServicesSection() {
  return (
    <section id="servicios" className="py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6"
          >
            Servicios de Vanguardia
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none"
          >
            SOLUCIONES CON <span className="text-brand-red dark:text-brand-yellow italic">PRECISIÓN</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="premium-card p-10 group"
            >
              <div className={`w-16 h-16 ${service.bg} rounded-[1.5rem] flex items-center justify-center mb-8 transition-transform group-hover:rotate-6`}>
                <service.icon className={`w-8 h-8 ${service.color}`} />
              </div>
              
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-none group-hover:text-brand-red dark:group-hover:text-brand-yellow transition-colors">
                {service.title}
              </h4>
              
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-light tracking-tight mb-8">
                {service.desc}
              </p>
              
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase group-hover:text-brand-red dark:group-hover:text-brand-yellow transition-colors">
                Explorar Más <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
