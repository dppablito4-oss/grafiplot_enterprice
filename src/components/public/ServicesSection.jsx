import { motion } from 'framer-motion';
import { Printer, Scissors, Scan, Maximize2, FileText, Cpu } from 'lucide-react';

const services = [
  {
    title: 'Impresión de Alta Fidelidad',
    desc: 'Documentos, tesis y separatas con nitidez láser y colores vibrantes en diversos gramajes.',
    icon: Printer,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Ploteo Técnico & Planos',
    desc: 'Precisión absoluta para ingeniería y arquitectura en tamaños A2, A1 y A0.',
    icon: Maximize2,
    color: 'text-brand-red',
    bg: 'bg-brand-red/10',
  },
  {
    title: 'Acabados Premium',
    desc: 'Encuadernación, laminado y cortes de precisión para una presentación profesional.',
    icon: Scissors,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    title: 'Digitalización Inteligente',
    desc: 'Escaneo de alta resolución y conversión a formatos editables para tus archivos.',
    icon: Scan,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Formato Académico APA',
    desc: 'Asesoría técnica en diagramación y márgenes según normativas universitarias.',
    icon: FileText,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Soporte Técnico Especializado',
    desc: 'Mantenimiento, optimización y actualización de hardware para tu productividad.',
    icon: Cpu,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
];

export function ServicesSection() {
  return (
    <section id="servicios" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-red/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black tracking-[0.4em] uppercase text-brand-red mb-4"
          >
            Nuestras Capacidades
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Servicios diseñados para la <span className="text-gradient">eficiencia máxima</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-panel p-8 rounded-[2.5rem] group cursor-default transition-all hover:border-white/20"
            >
              <div className={`w-14 h-14 ${service.bg} rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform`}>
                <service.icon className={`w-7 h-7 ${service.color}`} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-brand-red transition-colors">
                {service.title}
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {service.desc}
              </p>
              
              <div className="mt-8 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold text-white tracking-widest uppercase">
                Consultar Servicio <div className="w-8 h-[1px] bg-brand-red" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
